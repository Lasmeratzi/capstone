import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import AuctionBids from "../comments/auctionbids";
import ReportsModal from "../../components/modals/reportsmodal";
import { X, Clock, Tag, User, Gavel, Zap, MoreVertical, Flag, Calculator } from "lucide-react";

const API_BASE = "http://localhost:5000";

// ✅ Format number with commas and 2 decimal places
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₱0.00";
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return "₱0.00";
  
  // Format with commas and exactly 2 decimal places
  return `₱${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-2">
    <CheckIcon className="w-3 h-3 text-white" />
  </div>
);

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  // Existing states
  const [menuOpen, setMenuOpen] = useState(null);
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    auction: null,
  });

  // New states for reminders
  const [reminders, setReminders] = useState({}); // { auctionId: true/false }
  const [loadingReminders, setLoadingReminders] = useState({}); // { auctionId: true/false }

  // ✅ Function to refresh auction list
  const refreshAuctions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      const res = await axios.get(`${API_BASE}/api/auctions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const auctionsWithMedia = await Promise.all(
        res.data.map(async (auction) => {
          const mediaRes = await axios.get(
            `${API_BASE}/api/auction-media/${auction.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return {
            ...auction,
            media: mediaRes.data,
          };
        })
      );

      setAuctions(auctionsWithMedia);
      
      // Re-check reminders
      checkAllReminders(auctionsWithMedia, token);
    } catch (err) {
      console.error("Error refreshing auctions:", err);
    }
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/auctions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const auctionsWithMedia = await Promise.all(
          res.data.map(async (auction) => {
            const mediaRes = await axios.get(
              `${API_BASE}/api/auction-media/${auction.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...auction,
              media: mediaRes.data,
            };
          })
        );

        setAuctions(auctionsWithMedia);
        
        // Check reminders for each auction
        checkAllReminders(auctionsWithMedia, token);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setErrorMessage("Failed to load auctions.");
      }
    };

    fetchAuctions();
  }, []);

  // Function to check reminder status for all auctions
  const checkAllReminders = async (auctionsList, token) => {
    const newReminders = {};
    const newLoading = {};

    for (const auction of auctionsList) {
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

  // Countdown component
  const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const difference = new Date(endTime) - new Date();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearTimeout(timer);
    });

    const isEnded = Object.values(timeLeft).every(val => val === 0);
    const isLessThanHour = timeLeft.days === 0 && timeLeft.hours === 0;

    if (isEnded) {
      return (
        <div className="bg-red-100 border border-red-300 rounded px-3 py-2">
          <p className="text-red-700 font-semibold text-sm">Auction Ended</p>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
        isLessThanHour ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-blue-100 text-blue-700 border border-blue-200'
      }`}>
        <Clock className="w-4 h-4" />
        <span className="font-semibold">{isLessThanHour ? 'ENDING SOON' : 'LIVE'}</span>
        <span className="mx-1">•</span>
        <span>{timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}</span>
        <span>{timeLeft.hours.toString().padStart(2, '0')}:</span>
        <span>{timeLeft.minutes.toString().padStart(2, '0')}:</span>
        <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
      </div>
    );
  };

  // Get current user ID from token
  const getCurrentUserId = () => {
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

  // Check if auction is not yet active (can set reminder)
  const canSetReminder = (auction) => {
    return auction.status === 'pending' || auction.status === 'approved' || auction.status === 'draft';
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <p className="text-center text-red-500 mb-4">{errorMessage}</p>
      )}
      {auctions.length > 0 ? (
        auctions.map((auction) => {
          const currentUserId = getCurrentUserId();
          const isAuthor = String(auction.author_id) === String(currentUserId);
          const hasReminder = reminders[auction.id] || false;
          const isLoading = loadingReminders[auction.id] || false;
          const showReminderButton = canSetReminder(auction) && !isAuthor;
          
          return (
            <div
              key={auction.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Three dots menu - Top Right Corner */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setMenuOpen(menuOpen === auction.id ? null : auction.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                
                {menuOpen === auction.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    {/* Author-only options */}
                    {isAuthor && (
                      <>
                        <button
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm"
                          onClick={() => {
                            alert("Edit auction functionality coming soon!");
                            setMenuOpen(null);
                          }}
                        >
                          Edit Auction
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 text-sm"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this auction?")) {
                              alert("Delete auction functionality coming soon!");
                            }
                            setMenuOpen(null);
                          }}
                        >
                          Delete Auction
                        </button>
                      </>
                    )}
                    
                    {/* Report button for non-authors */}
                    {!isAuthor && (
                      <button
                        className="w-full px-4 py-2 text-left text-orange-500 hover:bg-gray-100 text-sm flex items-center gap-2"
                        onClick={() => {
                          setReportModal({ isOpen: true, auction });
                          setMenuOpen(null);
                        }}
                      >
                        <Flag size={14} />
                        Report Auction
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 pt-12">
                {/* Two div layout */}
                <div className="flex gap-6">
                  {/* Left Div - Author and Image */}
                  <div className="flex-shrink-0 w-64">
                    {/* Author Info - Top Left */}
                    <div className="flex items-center gap-3 mb-4">
                      {auction.author_pfp ? (
                        <img
                          src={`${API_BASE}/uploads/${auction.author_pfp}`}
                          alt={`${auction.author}'s profile`}
                          className="w-10 h-10 rounded-full border-2 border-blue-200 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center">
                          <p className="font-bold text-gray-900">@{auction.author_username}</p>
                          {auction.is_verified && <VerifiedBadge />}
                        </div>
                        <p className="text-gray-600 text-sm">{auction.author_fullname}</p>
                      </div>
                    </div>

                    {/* Auction Image - Below Author */}
                    {auction.media && auction.media.length > 0 && (
                      <div
                        className="relative w-full h-64 cursor-pointer group"
                        onClick={() => setSelectedMedia(auction.media[0])}
                      >
                        <img
                          src={`${API_BASE}/uploads/${auction.media[0].media_path}`}
                          alt="Auction media"
                          className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                        {auction.media.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">+{auction.media.length - 1}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Div - All Content */}
                  <div className="flex-grow min-w-0">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          auction.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : auction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : auction.status === "approved"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        {auction.status.toUpperCase()}
                      </span>
                      
                      {/* Reminder Button - Only show for non-active auctions and non-authors */}
                      {showReminderButton && (
                        <button
                          onClick={() => toggleReminder(auction.id)}
                          disabled={isLoading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            hasReminder
                              ? "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          ) : hasReminder ? (
                            <>
                              <BellSlashIcon className="w-4 h-4" />
                              <span>Remove Reminder</span>
                            </>
                          ) : (
                            <>
                              <BellIcon className="w-4 h-4" />
                              <span>Remind Me</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Title and Description */}
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">
                        {auction.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {auction.description}
                      </p>
                    </div>

                    {/* Price Info */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">Starting Price</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(auction.starting_price)}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Current Bid</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(auction.current_price)}</p>
                      </div>

                      {/* Bid Increment Info */}
                      <div className={`rounded-lg p-4 border ${
                        auction.use_increment 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {auction.use_increment ? (
                            <>
                              <Calculator className="w-5 h-5 text-purple-600" />
                              <span className="text-sm font-semibold text-purple-800">Bid Increment</span>
                            </>
                          ) : (
                            <>
                              <Gavel className="w-5 h-5 text-gray-600" />
                              <span className="text-sm font-semibold text-gray-800">Bidding Rules</span>
                            </>
                          )}
                        </div>
                        
                        {auction.use_increment ? (
                          <>
                            <p className="text-2xl font-bold text-purple-700">{formatCurrency(auction.bid_increment || 100)}</p>
                            <p className="text-xs text-purple-600 mt-1">
                              Bids must increase by exactly {formatCurrency(auction.bid_increment || 100)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg font-bold text-gray-700">Free Bidding</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Bid any amount above current price
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Countdown Timer - Only show for active auctions */}
                    {auction.status === "active" && (
                      <div className="mb-4">
                        <CountdownTimer endTime={auction.end_time} />
                      </div>
                    )}

                    {/* Show auction start time for pending/approved auctions */}
                    {(auction.status === "pending" || auction.status === "approved") && auction.auction_start_time && (
                      <div className="mb-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 inline-flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">
                            Starts: {new Date(auction.auction_start_time).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Auction Results when Ended */}
                    {auction.status === "ended" && auction.winner_id && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-800">Auction Results</span>
                        </div>
                        <p className="text-lg font-bold text-purple-700">
                          Sold for {formatCurrency(auction.final_price || auction.current_price)}
                        </p>
                        <p className="text-sm text-purple-600 mt-1">
                          Winner has been notified to complete the transaction
                        </p>
                      </div>
                    )}

                    {/* Auction Bidding Form */}
                    {auction.status === "active" && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <AuctionBids 
                          auctionId={auction.id} 
                          currentPrice={parseFloat(auction.current_price)} 
                          refreshAuctions={refreshAuctions} // ✅ Pass the refresh function
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto border border-gray-200">
            <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Auctions</h3>
            <p className="text-gray-600">Check back later for new auction listings</p>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-transform hover:scale-110 z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            <div className="bg-white rounded-xl overflow-hidden">
              <img
                src={`${API_BASE}/uploads/${selectedMedia.media_path}`}
                alt="Auction media preview"
                className="max-h-[80vh] w-auto max-w-full mx-auto object-contain"
              />
            </div>
        </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal.isOpen && reportModal.auction && (
        <ReportsModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ isOpen: false, auction: null })}
          contentType="auction"
          contentId={reportModal.auction.id}
          contentAuthorId={reportModal.auction.author_id}
        />
      )}
    </div>
  );
};

export default Auctions;