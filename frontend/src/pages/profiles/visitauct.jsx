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
      const auctionsData = response.data.filter(auction => String(auction.author_id) === String(userId));
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
          alert("Reminder set! You'll be notified when this auction goes live.");
        } else {
          alert("Reminder removed.");
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
          bg: 'bg-green-100 dark:bg-green-900/20', 
          text: 'text-green-700 dark:text-green-400', 
          border: 'border-green-200 dark:border-green-800/30', 
          icon: <Clock size={14} />, 
          label: 'Live Now' 
        };
      case 'ended':
        return { 
          bg: 'bg-purple-100 dark:bg-purple-900/20', 
          text: 'text-purple-700 dark:text-purple-400', 
          border: 'border-purple-200 dark:border-purple-800/30', 
          icon: <Trophy size={14} />, 
          label: 'Ended' 
        };
      case 'draft':
        return { 
          bg: 'bg-gray-100 dark:bg-white/5', 
          text: 'text-gray-700 dark:text-gray-400', 
          border: 'border-gray-200 dark:border-white/10', 
          icon: null, 
          label: 'Draft' 
        };
      case 'pending':
        return { 
          bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
          text: 'text-yellow-700 dark:text-yellow-400', 
          border: 'border-yellow-200 dark:border-yellow-800/30', 
          icon: <Clock size={14} />, 
          label: 'Pending Approval' 
        };
      case 'approved':
        return { 
          bg: 'bg-blue-100 dark:bg-blue-900/20', 
          text: 'text-blue-700 dark:text-blue-400', 
          border: 'border-blue-200 dark:border-blue-800/30', 
          icon: <CheckCircle size={14} />, 
          label: 'Approved' 
        };
      case 'rejected':
        return { 
          bg: 'bg-red-100 dark:bg-red-900/20', 
          text: 'text-red-700 dark:text-red-400', 
          border: 'border-red-200 dark:border-red-800/30', 
          icon: <XCircle size={14} />, 
          label: 'Rejected' 
        };
      case 'stopped':
        return { 
          bg: 'bg-orange-100 dark:bg-orange-900/20', 
          text: 'text-orange-700 dark:text-orange-400', 
          border: 'border-orange-200 dark:border-orange-800/30', 
          icon: <XCircle size={14} />, 
          label: 'Stopped' 
        };
      default:
        return { 
          bg: 'bg-gray-100 dark:bg-white/5', 
          text: 'text-gray-700 dark:text-gray-400', 
          border: 'border-gray-200 dark:border-white/10', 
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
    
    // Check if it's already a full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Remove leading slash and duplicate uploads/ if present
    const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
    
    const url = `${API_BASE}/uploads/${cleanPath}`;
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
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Auctions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredAuctions.length}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Active Auctions</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {filteredAuctions.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">With Increments</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">
                    {filteredAuctions.filter(a => a.use_increment === 1).length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Calculator className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Highest Bid</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                    ₱{formatPrice(Math.max(...filteredAuctions.map(a => a.current_price || a.starting_price))) || '0.00'}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
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
            <div className="text-center py-12 bg-white dark:bg-[#161B22] rounded-xl border border-gray-200 dark:border-white/5">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No auctions available</h3>
              <p className="text-gray-500 dark:text-gray-400">This user hasn't created any auctions yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAuctions.map((auction) => {
                const statusBadge = getStatusBadge(auction.status);
                const hasWinner = auction.status === 'ended' && auction.winner_id;
                const winnerUsername = auction.winner_username;
                const winnerPfp = auction.winner_pfp;
                const useIncrement = auction.use_increment === 1;
                const bidIncrement = auction.bid_increment || 100;
                
                // Reminder state for this auction
                const hasReminder = reminders[auction.id] || false;
                const isLoadingReminder = loadingReminders[auction.id] || false;
                const showReminderButton = canUserSetReminder(auction);
                
                return (
                  <div key={auction.id} className="bg-white dark:bg-[#0A0A0B] rounded-xl shadow-md border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 group">
                    {/* Auction Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {auction.author_pfp ? (
                            <img
                              src={getImageUrl(auction.author_pfp)}
                              alt={`${auction.author_username}'s profile`}
                              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {auction.author_username?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100">@{auction.author_username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(auction.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Reminder Button */}
                          {showReminderButton && (
                            <button
                              onClick={() => toggleReminder(auction.id)}
                              disabled={isLoadingReminder}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                hasReminder
                                  ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800/30"
                                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10"
                              } ${isLoadingReminder ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {isLoadingReminder ? (
                                <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              ) : hasReminder ? (
                                <BellOff size={14} />
                              ) : (
                                <Bell size={14} />
                              )}
                              <span>{hasReminder ? "Remove Reminder" : "Remind Me"}</span>
                            </button>
                          )}
                          
                          {/* Status badge */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} dark:bg-opacity-20`}>
                            {statusBadge.icon}
                            <span>{statusBadge.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Auction Content Area */}
                    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
                      {/* Left: Images */}
                      <div className="md:w-1/3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Images ({auction.media?.length || 0})</p>
                        {auction.media?.length > 0 ? (
                          <div className="space-y-3">
                            <div 
                              className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 cursor-pointer group"
                              onClick={() => setSelectedMedia(auction.media[0])}
                            >
                              <img
                                src={getImageUrl(auction.media[0].media_path)}
                                alt={auction.title}
                                className="w-full h-full object-cover transition-transform duration-500"
                              />
                              {auction.media.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                                  +{auction.media.length - 1} more
                                </div>
                              )}
                            </div>
                            {/* Thumbnails */}
                            {auction.media.length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {auction.media.slice(1, 4).map((file, idx) => (
                                  <div 
                                    key={file.id} 
                                    className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 cursor-pointer transition"
                                    onClick={() => setSelectedMedia(file)}
                                  >
                                    <img
                                      src={getImageUrl(file.media_path)}
                                      alt="Thumbnail"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                                {auction.media.length > 4 && (
                                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                    +{auction.media.length - 4}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-square rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center">
                            <p className="text-xs text-gray-400">No media available</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="space-y-5">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">{auction.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{auction.description}</p>
                          </div>

                          {/* Price Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Starting Price</p>
                              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">₱{formatPrice(auction.starting_price)}</p>
                            </div>
                            
                            <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">Current Price</p>
                              <p className="text-lg font-bold text-green-900 dark:text-green-100">₱{formatPrice(auction.current_price || auction.starting_price)}</p>
                            </div>

                            <div className={`sm:col-span-2 p-3 rounded-xl border ${
                              useIncrement 
                                ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20'
                                : 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5'
                            }`}>
                              <div className="flex items-center justify-between">
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${useIncrement ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                                  {useIncrement ? 'Bid Increment' : 'Bidding Rules'}
                                </p>
                                {useIncrement && <Calculator size={14} className="text-purple-400" />}
                              </div>
                              {useIncrement ? (
                                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">₱{formatPrice(bidIncrement)}</p>
                              ) : (
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Free Bidding</p>
                              )}
                            </div>
                          </div>

                          {/* Time Info */}
                          <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Started</p>
                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                  {new Date(auction.auction_start_time || auction.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ended</p>
                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                  {new Date(auction.end_time).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Winner Details */}
                          {hasWinner && winnerUsername && (
                            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-xl border border-purple-500/20">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">Auction Winner</p>
                              <div className="flex items-center gap-3">
                                {winnerPfp ? (
                                  <img
                                    src={getImageUrl(winnerPfp)}
                                    alt={winnerUsername}
                                    className="w-10 h-10 rounded-full border-2 border-purple-300 shadow-sm object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                    <Trophy size={18} />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">@{winnerUsername}</p>
                                  <p className="text-xs text-purple-600 dark:text-purple-400">
                                    Won for ₱{formatPrice(auction.final_price || auction.current_price || auction.starting_price)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Scheduled Note */}
                          {(auction.status === 'pending' || auction.status === 'approved') && auction.auction_start_time && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-xl p-3 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">
                                Starts: {new Date(auction.auction_start_time).toLocaleString()}
                              </span>
                            </div>
                          )}

                          {/* Bidding/Action Section */}
                          <div className="mt-4 pt-6 border-t border-gray-100 dark:border-white/5">
                            {auction.status === "active" ? (
                              <AuctionBids 
                                auctionId={auction.id} 
                                currentPrice={auction.current_price} 
                                refreshAuctions={refreshAuctions}
                              />
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                  {auction.status === 'pending' ? "Awaiting admin approval" : 
                                   auction.status === 'approved' ? "Scheduled to start soon" : 
                                   auction.status === 'ended' ? "Bidding has concluded" : "Bidding unavailable"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
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
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Filters & Sorting</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <SortAsc size={16} /> Sort by
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0A0A0B] border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#5E66FF]/50 text-gray-900 dark:text-gray-100 transition-all cursor-pointer"
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} /> Filter by year
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                      className="w-full flex items-center justify-between gap-1 bg-gray-50 dark:bg-[#0A0A0B] border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-900 dark:text-gray-100"
                    >
                      {yearFilter === "all" ? "All years" : yearFilter}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${showYearDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showYearDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#0A0A0B] border border-gray-300 dark:border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <button
                          onClick={() => {
                            setYearFilter("all");
                            setShowYearDropdown(false);
                          }}
                          className={`block w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
                            yearFilter === "all" ? "bg-gray-100 dark:bg-white/5 font-bold text-[#5E66FF]" : "text-gray-600 dark:text-gray-400"
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
                            className={`block w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
                              yearFilter === year.toString() ? "bg-gray-100 dark:bg-white/5 font-bold text-[#5E66FF]" : "text-gray-600 dark:text-gray-400"
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
            <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Auction Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                    <span className="text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-tight">Active</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                    {filteredAuctions.filter(a => a.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-500 uppercase tracking-tight">Ended</span>
                  </div>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                    {filteredAuctions.filter(a => a.status === 'ended').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]"></div>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-tight">Pending</span>
                  </div>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                    {filteredAuctions.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-500 uppercase tracking-tight">Approved</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
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