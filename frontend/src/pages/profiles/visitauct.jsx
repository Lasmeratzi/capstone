import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  X, 
  SortAsc, 
  Calendar, 
  ChevronDown, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  DollarSign, 
  Calendar as CalendarIcon,
  Tag,
  Image,
  User,
  Calculator,
  Bell,
  BellOff
} from "lucide-react";
import AuctionBids from "../comments/auctionbids";

const API_BASE = "http://localhost:5000";

const VisitAuct = ({ userId }) => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  // New states for reminders
  const [reminders, setReminders] = useState({}); // { auctionId: true/false }
  const [loadingReminders, setLoadingReminders] = useState({}); // { auctionId: true/false }
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from token
  const getCurrentUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getCurrentUserIdFromToken();
    setCurrentUserId(userId);
  }, []);

  const fetchUserAuctions = async () => {
    try {
      setLoading(true);
      if (!userId) return;

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      console.log("🔍 Fetching auctions for user ID:", userId);
      const response = await axios.get(`${API_BASE}/api/auctions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔍 Raw API response:", response.data);
      const auctionsData = response.data.filter(auction => auction.author_id === userId);
      console.log("🔍 Filtered auctions (author_id matches):", auctionsData);

      // Check the first auction's structure
      if (auctionsData.length > 0) {
        console.log("🔍 First auction object structure:", Object.keys(auctionsData[0]));
        console.log("🔍 First auction data:", auctionsData[0]);
        
        // Check for increment fields
        const auction = auctionsData[0];
        console.log("🔍 Increment check for first auction:");
        console.log("   - use_increment:", auction.use_increment);
        console.log("   - bid_increment:", auction.bid_increment);
        console.log("   - winner_id:", auction.winner_id);
        console.log("   - winner_username:", auction.winner_username);
      }

      const mediaRequests = auctionsData.map((auction) =>
        axios.get(`${API_BASE}/api/auction-media/${auction.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const mediaResponses = await Promise.all(mediaRequests);

      // DEBUG: Log media data
      mediaResponses.forEach((response, index) => {
        console.log(`🔍 Media for auction ${auctionsData[index].id}:`, response.data);
        if (response.data && response.data.length > 0) {
          console.log(`🔍 First media path:`, response.data[0].media_path);
          console.log(`🔍 Constructed URL:`, getImageUrl(response.data[0].media_path));
        }
      });

      const auctionsWithMedia = auctionsData.map((auction, index) => ({
        ...auction,
        media: mediaResponses[index].data || [],
        createdAt: new Date(auction.created_at)
      }));

      console.log("🔍 Fetched auctions with media:", auctionsWithMedia);
      setAuctions(auctionsWithMedia);

      // Check reminders for each auction
      if (currentUserId) {
        checkAllReminders(auctionsWithMedia, token);
      }

      const years = [...new Set(auctionsWithMedia.map(auction => 
        new Date(auction.created_at).getFullYear()
      ))].sort((a, b) => b - a);

      setAvailableYears(years);
    } catch (error) {
      console.error("Failed to fetch user auctions:", error);
      setErrorMessage("Failed to load auctions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAuctions();
  }, [userId, currentUserId]);

  useEffect(() => {
    let result = [...auctions];
    
    if (yearFilter !== "all") {
      result = result.filter(auction => 
        new Date(auction.created_at).getFullYear().toString() === yearFilter
      );
    }
    
    if (sortOption === "latest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === "oldest") {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => (b.current_price || b.starting_price) - (a.current_price || a.starting_price));
    } else if (sortOption === "price-low") {
      result.sort((a, b) => (a.current_price || a.starting_price) - (b.current_price || b.starting_price));
    }
    
    setFilteredAuctions(result);
  }, [auctions, sortOption, yearFilter]);

  // Function to check reminder status for all auctions
  const checkAllReminders = async (auctionsList, token) => {
    const newReminders = {};
    const newLoading = {};

    for (const auction of auctionsList) {
      // Only check for auctions that are not active and not by current user
      if (canSetReminder(auction) && String(auction.author_id) !== String(currentUserId)) {
        newLoading[auction.id] = true;
        try {
          const response = await axios.get(
            `${API_BASE}/api/auctionreminders/check/${auction.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          newReminders[auction.id] = response.data.hasReminder;
        } catch (error) {
          console.error(`Error checking reminder for auction ${auction.id}:`, error);
          newReminders[auction.id] = false;
        }
        newLoading[auction.id] = false;
      }
    }

    setReminders(newReminders);
    setLoadingReminders(newLoading);
  };

  // Toggle reminder for an auction
  const toggleReminder = async (auctionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to set reminders");
        return;
      }

      setLoadingReminders(prev => ({ ...prev, [auctionId]: true }));

      const response = await axios.post(
        `${API_BASE}/api/auctionreminders/toggle`,
        { auctionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setReminders(prev => ({
          ...prev,
          [auctionId]: response.data.hasReminder
        }));
        
        // Show success message
        if (response.data.hasReminder) {
          alert("✅ Reminder set! You'll be notified when this auction goes live.");
        } else {
          alert("ℹ️ Reminder removed.");
        }
      }
    } catch (error) {
      console.error("Error toggling reminder:", error);
      alert("Failed to update reminder. Please try again.");
    } finally {
      setLoadingReminders(prev => ({ ...prev, [auctionId]: false }));
    }
  };

  const refreshAuctions = async () => {
    await fetchUserAuctions();
  };

  // Check if auction is not yet active (can set reminder)
  const canSetReminder = (auction) => {
    return (auction.status === 'pending' || auction.status === 'approved' || auction.status === 'draft');
  };

  // Check if current user can set reminder for this auction
  const canUserSetReminder = (auction) => {
    if (!currentUserId) return false;
    if (String(auction.author_id) === String(currentUserId)) return false; // Can't set reminder for own auction
    return canSetReminder(auction);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-700', 
          border: 'border-green-200', 
          icon: <Clock size={14} />, 
          label: 'Live Now' 
        };
      case 'ended':
        return { 
          bg: 'bg-purple-100', 
          text: 'text-purple-700', 
          border: 'border-purple-200', 
          icon: <Trophy size={14} />, 
          label: 'Ended' 
        };
      case 'draft':
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-700', 
          border: 'border-gray-200', 
          icon: null, 
          label: 'Draft' 
        };
      case 'pending':
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-700', 
          border: 'border-yellow-200', 
          icon: <Clock size={14} />, 
          label: 'Pending Approval' 
        };
      case 'approved':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-700', 
          border: 'border-blue-200', 
          icon: <CheckCircle size={14} />, 
          label: 'Approved' 
        };
      case 'rejected':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-700', 
          border: 'border-red-200', 
          icon: <XCircle size={14} />, 
          label: 'Rejected' 
        };
      case 'stopped':
        return { 
          bg: 'bg-orange-100', 
          text: 'text-orange-700', 
          border: 'border-orange-200', 
          icon: <XCircle size={14} />, 
          label: 'Stopped' 
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-700', 
          border: 'border-gray-200', 
          icon: null, 
          label: status 
        };
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    
    console.log("🔍 getImageUrl called with path:", path);
    
    // Check if it's already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // For profile pictures and other images, they might already have 'uploads/' prefix
    // But for auction media, the path is stored as 'auctions/filename.jpg'
    // So we need to prepend 'uploads/' to all relative paths
    
    let cleanPath = path;
    
    // Remove leading slash if present
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    console.log("🔍 Clean path:", cleanPath);
    
    // If it doesn't already start with 'uploads/', add it
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
    
    const url = `${API_BASE}/${cleanPath}`;
    console.log("🔍 Constructed URL:", url);
    return url;
  };

  return (
    <div className="w-full">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Stats and Auctions (2/3 width) */}
        <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Auctions</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredAuctions.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Auctions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredAuctions.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With Increments</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredAuctions.filter(a => a.use_increment === 1).length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Highest Bid</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ₱{formatPrice(Math.max(...filteredAuctions.map(a => a.current_price || a.starting_price))) || '0.00'}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Auction Listings */}
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading auctions...</div>
          )}

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          {!loading && filteredAuctions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions available</h3>
              <p className="text-gray-500">This user hasn't created any auctions yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAuctions.map((auction) => {
                const statusBadge = getStatusBadge(auction.status);
                const hasWinner = auction.status === 'ended' && auction.winner_id;
                const winnerUsername = auction.winner_username;
                const winnerPfp = auction.winner_pfp;
                const winnerFullname = auction.winner_fullname;
                const useIncrement = auction.use_increment === 1;
                const bidIncrement = auction.bid_increment || 100;
                
                // Reminder state for this auction
                const hasReminder = reminders[auction.id] || false;
                const isLoadingReminder = loadingReminders[auction.id] || false;
                const showReminderButton = canUserSetReminder(auction);
                
                console.log(`🔍 Rendering auction ${auction.id}:`, {
                  status: auction.status,
                  hasWinner,
                  use_increment: useIncrement,
                  bid_increment: bidIncrement,
                  winner_id: auction.winner_id,
                  winner_username: winnerUsername,
                  showReminderButton,
                  hasReminder,
                  author_id: auction.author_id,
                  currentUserId
                });
                
                return (
                  <div key={auction.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    {/* Auction Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {auction.author_pfp ? (
                            <img
                              src={getImageUrl(auction.author_pfp)}
                              alt={`${auction.author_username}'s profile`}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {auction.author_username?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800">{auction.author_username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(auction.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Reminder Button - Only show for non-active auctions and non-authors */}
                          {showReminderButton && (
                            <button
                              onClick={() => toggleReminder(auction.id)}
                              disabled={isLoadingReminder}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                hasReminder
                                  ? "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                              } ${isLoadingReminder ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}`}
                            >
                              {isLoadingReminder ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              ) : hasReminder ? (
                                <>
                                  <BellOff size={14} />
                                  <span>Remove Reminder</span>
                                </>
                              ) : (
                                <>
                                  <Bell size={14} />
                                  <span>Remind Me</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          {/* Increment badge */}
                          {useIncrement && auction.status === 'active' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                              <Calculator size={14} />
                              <span>₱{formatPrice(bidIncrement)} Increment</span>
                            </div>
                          )}
                          
                          {/* Status badge */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.icon}
                            <span>{statusBadge.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Auction Content */}
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Auction Details */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h3>
                            <p className="text-gray-600">{auction.description}</p>
                          </div>

                          {/* Price Cards - Updated to 3 columns */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                                <p className="text-sm font-medium text-blue-800">Starting Price</p>
                              </div>
                              <p className="text-2xl font-bold text-blue-900">₱{formatPrice(auction.starting_price)}</p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <ArrowRight className="h-5 w-5 text-green-600" />
                                <p className="text-sm font-medium text-green-800">Current Price</p>
                              </div>
                              <p className="text-2xl font-bold text-green-900">₱{formatPrice(auction.current_price || auction.starting_price)}</p>
                            </div>

                            {/* NEW: Bid Increment Card */}
                            <div className={`p-4 rounded-xl border ${
                              useIncrement 
                                ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'
                                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Calculator className={`h-5 w-5 ${useIncrement ? 'text-purple-600' : 'text-gray-500'}`} />
                                <p className={`text-sm font-medium ${useIncrement ? 'text-purple-800' : 'text-gray-700'}`}>
                                  {useIncrement ? 'Bid Increment' : 'Bidding Rules'}
                                </p>
                              </div>
                              {useIncrement ? (
                                <>
                                  <p className="text-2xl font-bold text-purple-900">₱{formatPrice(bidIncrement)}</p>
                                  <p className="text-xs text-purple-700 mt-1">
                                    Bids increase by ₱{formatPrice(bidIncrement)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-xl font-bold text-gray-900">Free Bidding</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Bid any amount above current
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Time Information */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-3">
                                <CalendarIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Started</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(auction.auction_start_time || auction.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-500">Ended</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(auction.end_time).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Winner Info - only show if we have a winner */}
                          {hasWinner && winnerUsername && (
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                              <div className="flex items-center gap-3 mb-3">
                                <Trophy className="h-6 w-6 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-purple-800">WINNER DETAILS</p>
                                  <p className="text-xs text-purple-600">Auction successfully completed</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {winnerPfp ? (
                                  <img
                                    src={getImageUrl(winnerPfp)}
                                    alt={`${winnerFullname || winnerUsername}'s profile`}
                                    className="w-10 h-10 rounded-full border-2 border-purple-300 shadow-sm object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                    <User size={20} />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-purple-900">@{winnerUsername}</p>
                                  <p className="text-sm text-purple-700">
                                    Won with ₱{formatPrice(auction.final_price || auction.current_price || auction.starting_price)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Show if auction ended but no winner */}
                          {auction.status === 'ended' && !hasWinner && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-3">
                                <Trophy className="h-6 w-6 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">AUCTION ENDED</p>
                                  <p className="text-xs text-gray-600">No bids were placed on this auction</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Show start time for pending/approved auctions */}
                          {(auction.status === 'pending' || auction.status === 'approved') && auction.auction_start_time && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">
                                  Scheduled to start: {new Date(auction.auction_start_time).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column: IMAGES */}
                        <div className="space-y-4">
                          {/* Main Featured Image */}
                          {auction.media?.length > 0 ? (
                            <div className="space-y-3">
                              <div className="relative group">
                                <div
                                  className="relative aspect-square w-full rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                                  onClick={() => setSelectedMedia(auction.media[0])}
                                >
                                  <img
                                    src={getImageUrl(auction.media[0].media_path)}
                                    alt="Auction featured"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                    Featured
                                  </div>
                                </div>
                              </div>

                              {/* Additional Images Grid */}
                              {auction.media.length > 1 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {auction.media.slice(1).map((file, index) => (
                                    <div
                                      key={file.id}
                                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100 group"
                                      onClick={() => setSelectedMedia(file)}
                                    >
                                      <img
                                        src={getImageUrl(file.media_path)}
                                        alt={`Auction image ${index + 2}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                      {index === auction.media.length - 2 && auction.media.length > 3 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                          <span className="text-white text-sm font-medium">
                                            +{auction.media.length - 3} more
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center">
                              <div className="text-center p-4">
                                <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No images available</p>
                              </div>
                            </div>
                          )}

                          {/* Image Counter */}
                          {auction.media?.length > 0 && (
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Image className="h-4 w-4" />
                                {auction.media.length} image{auction.media.length !== 1 ? 's' : ''}
                              </span>
                              <button 
                                onClick={() => auction.media?.length > 0 && setSelectedMedia(auction.media[0])}
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                              >
                                View all
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bidding/Action Section */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        {auction.status === "active" ? (
                          <AuctionBids 
                            auctionId={auction.id} 
                            currentPrice={auction.current_price} 
                            refreshAuctions={refreshAuctions}
                          />
                        ) : (
                          <div className="text-center p-4">
                            <div className="text-sm text-gray-500">
                              {auction.status === 'pending' && "Awaiting admin approval"}
                              {auction.status === 'approved' && "Scheduled to start soon"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Filters (1/3 width) */}
        <div className="lg:w-80">
          <div className="sticky top-4 space-y-4">
            {/* Filters Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sorting</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <SortAsc size={16} /> Sort by
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} /> Filter by year
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                      className="w-full flex items-center justify-between gap-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                    >
                      {yearFilter === "all" ? "All years" : yearFilter}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${showYearDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showYearDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <button
                          onClick={() => {
                            setYearFilter("all");
                            setShowYearDropdown(false);
                          }}
                          className={`block w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 ${
                            yearFilter === "all" ? "bg-gray-100 font-medium" : ""
                          }`}
                        >
                          All years
                        </button>
                        {availableYears.map((year) => (
                          <button
                            key={year}
                            onClick={() => {
                              setYearFilter(year.toString());
                              setShowYearDropdown(false);
                            }}
                            className={`block w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 ${
                              yearFilter === year.toString() ? "bg-gray-100 font-medium" : ""
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Legend Card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Auction Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-700">Active</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    {filteredAuctions.filter(a => a.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-purple-700">Ended</span>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">
                    {filteredAuctions.filter(a => a.status === 'ended').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-yellow-700">Pending</span>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">
                    {filteredAuctions.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-blue-700">Approved</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    {filteredAuctions.filter(a => a.status === 'approved').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition p-2 bg-black bg-opacity-50 rounded-full"
              aria-label="Close image viewer"
            >
              <X size={24} />
            </button>

            <img
              src={getImageUrl(selectedMedia.media_path)}
              alt="Auction preview"
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitAuct;