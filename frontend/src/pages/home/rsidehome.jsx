import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../components/modals/ReviewModal";
import axios from "axios";
import { Gavel, Clock, Tag } from "lucide-react";

const RSideHome = ({ user, accounts, onSwitchToAuctions }) => {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  
  // New states for auctions
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [loadingAuctions, setLoadingAuctions] = useState(false);

  // Fetch user's existing review
  useEffect(() => {
    fetchUserReview();
    fetchRecentAuctions();
  }, []);

  const fetchUserReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, user might not be logged in");
        return;
      }
      
      setLoadingReview(true);
      setReviewError("");
      
      console.log("🔍 Fetching user review...");
      const response = await axios.get('http://localhost:5000/api/reviews/myreview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("📦 Review response:", response.data);
      
      if (response.data.success) {
        setUserReview(response.data.review);
      } else {
        console.log("No review found or error:", response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
      if (error.response?.status === 401) {
        setReviewError("Please log in to leave a review");
      } else {
        setReviewError("Could not load review data");
      }
    } finally {
      setLoadingReview(false);
    }
  };

  const fetchRecentAuctions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, user might not be logged in");
        return;
      }
      
      setLoadingAuctions(true);
      
      const response = await axios.get('http://localhost:5000/api/auctions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter for active or approved auctions and get the 3 most recent
      const activeAuctions = response.data
        .filter(auction => auction.status === 'active' || auction.status === 'approved')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
      
      // Fetch media for each auction
      const auctionsWithMedia = await Promise.all(
        activeAuctions.map(async (auction) => {
          try {
            const mediaRes = await axios.get(
              `http://localhost:5000/api/auction-media/${auction.id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            return {
              ...auction,
              media: mediaRes.data
            };
          } catch (error) {
            console.error(`Error fetching media for auction ${auction.id}:`, error);
            return {
              ...auction,
              media: []
            };
          }
        })
      );
      
      setRecentAuctions(auctionsWithMedia);
    } catch (error) {
      console.error('Error fetching recent auctions:', error);
    } finally {
      setLoadingAuctions(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchUserReview();
  };

  const handleReviewClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to leave a review");
      navigate("/login");
      return;
    }
    setIsReviewModalOpen(true);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₱0.00";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return "₱0.00";
    return `₱${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleParticipate = (auctionId) => {
    if (onSwitchToAuctions) {
      onSwitchToAuctions();
    }
  };

  return (
    <div className="w-95 py-6 pr-4">
      {/* Logged In User */}
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        {user.pfp ? (
          <img
            src={`http://localhost:5000/uploads/${user.pfp}`}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">N/A</span>
          </div>
        )}
        <div className="ml-3">
          <p className="font-bold text-gray-800">{user.username}</p>
          <p className="text-gray-600 text-sm">{user.fullname}</p>
        </div>
      </div>

      {/* Recent Auctions Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 font-semibold">Recent Auctions</h3>
          <Gavel className="w-5 h-5 text-purple-600" />
        </div>
        
        {loadingAuctions ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : recentAuctions.length > 0 ? (
          <div className="space-y-3">
            {recentAuctions.map((auction) => (
              <div 
                key={auction.id} 
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-3">
                  {/* Auction Image */}
                  {auction.media && auction.media.length > 0 ? (
                    <img 
                      src={`http://localhost:5000/uploads/${auction.media[0].media_path}`}
                      alt={auction.title}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  
                  {/* Auction Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">
                      {auction.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Tag className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-green-700 font-semibold">
                        {formatCurrency(auction.current_price)}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        auction.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {auction.status === 'active' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Live
                          </>
                        ) : (
                          'Coming Soon'
                        )}
                      </span>
                    </div>
                    
                    {/* Participate Button */}
                    <button
                      onClick={() => handleParticipate(auction.id)}
                      className="mt-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded hover:shadow-md transition"
                    >
                      Participate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <Gavel className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No active auctions</p>
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">Follow other artists</h3>
        <div className="space-y-3">
          {accounts.slice(0, 3).map((account) => (
            <div key={account.id} className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
              <img src={`http://localhost:5000/uploads/${account.pfp || "default.png"}`} alt={account.username} className="w-10 h-10 rounded-full border" />
              <div className="ml-3">
                <p className="font-medium text-gray-800">{account.username}</p>
                <p className="text-gray-500 text-sm">{account.fullname}</p>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-gray-500 text-sm">No other users available.</p>}
        </div>

        {/* Review Button Section */}
        <div className="mt-8 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Help Improve Illura</h4>
                <p className="text-gray-600 text-sm">Share your experience</p>
              </div>
            </div>
            
            {reviewError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{reviewError}</p>
              </div>
            )}
            
            <button
              onClick={handleReviewClick}
              disabled={loadingReview}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingReview ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {userReview ? 'Edit Your Review' : 'Leave a Review'}
                </>
              )}
            </button>
            
            {userReview && !loadingReview && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center bg-white px-3 py-1 rounded-full border border-green-200">
                  <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 text-sm">You've reviewed Illura!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-400 space-x-2">
          <span 
            className="hover:underline cursor-pointer hover:text-gray-600"
            onClick={() => navigate("/about")}
          >
            About
          </span>·
          <span className="hover:underline cursor-pointer hover:text-gray-600">Help</span>·
          <span className="hover:underline cursor-pointer hover:text-gray-600">Privacy</span>·
          <span className="hover:underline cursor-pointer hover:text-gray-600">Terms</span>
          <p className="mt-3">&copy; 2025 Illura from Studio</p>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          userReview={userReview}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default RSideHome;