import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, SortAsc, Calendar, ChevronDown, Calculator } from "lucide-react"; // ADD Calculator

const API_BASE = "http://localhost:5000";

const OwnAuct = ({ userId }) => {
  const [auctions, setAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  useEffect(() => {
    const fetchOwnAuctions = async () => {
      try {
        setLoading(true);
        if (!userId) return;

        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please log in to view your auctions.");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/auctions/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const auctionsData = res.data;

        const mediaRequests = auctionsData.map((auction) =>
          axios.get(`${API_BASE}/api/auction-media/${auction.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const mediaResponses = await Promise.all(mediaRequests);
        const auctionsWithMedia = auctionsData.map((auction, index) => ({
          ...auction,
          media: mediaResponses[index].data || [],
          createdAt: new Date(auction.created_at),
        }));

        setAuctions(auctionsWithMedia);

        const years = [...new Set(auctionsWithMedia.map((auction) =>
          new Date(auction.created_at).getFullYear()
        ))].sort((a, b) => b - a);

        setAvailableYears(years);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setErrorMessage("Failed to load your auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnAuctions();
  }, [userId]);

  const filteredAuctions = auctions
    .filter((auction) =>
      yearFilter === "all"
        ? true
        : new Date(auction.created_at).getFullYear().toString() === yearFilter
    )
    .sort((a, b) =>
      sortOption === "latest"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
      case 'ended':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Ended' };
      case 'draft':
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
      case 'approved':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Approved' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">Total Auctions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredAuctions.length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredAuctions.filter(a => a.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">With Increments</p>
            <p className="text-2xl font-bold text-purple-600">
              {filteredAuctions.filter(a => a.use_increment === 1).length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">Ended</p>
            <p className="text-2xl font-bold text-blue-600">
              {filteredAuctions.filter(a => a.status === 'ended').length}
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">Loading auctions...</div>
        )}

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        {!loading && filteredAuctions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
              <p className="text-gray-500 text-sm">You haven't created any auctions yet.</p>
            </div>
          </div>
        ) : (
          filteredAuctions.map((auction) => {
            const statusBadge = getStatusBadge(auction.status);
            const useIncrement = auction.use_increment === 1;
            const bidIncrement = auction.bid_increment || 100;
            
            return (
              <div key={auction.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {auction.author_pfp ? (
                        <img
                          src={`${API_BASE}/uploads/${auction.author_pfp}`}
                          alt={`${auction.author_username}'s profile`}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {auction.author_username?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800">@{auction.author_username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(auction.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Increment Badge */}
                      {useIncrement && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                          <Calculator size={14} />
                          <span>₱{formatPrice(bidIncrement)} increment</span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h4>
                      <p className="text-gray-600">{auction.description}</p>
                    </div>

                    {/* Price Info - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Starting Price</p>
                        <p className="text-2xl font-bold text-blue-900">₱{formatPrice(auction.starting_price)}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-1">Current Price</p>
                        <p className="text-2xl font-bold text-green-900">₱{formatPrice(auction.current_price)}</p>
                      </div>
                      
                      {/* Bid Increment Card */}
                      <div className={`p-4 rounded-xl border ${
                        useIncrement 
                          ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                      }`}>
                        <p className={`text-sm font-medium mb-1 ${useIncrement ? 'text-purple-800' : 'text-gray-700'}`}>
                          {useIncrement ? 'Bid Increment' : 'Bidding Rules'}
                        </p>
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

                    {/* Time Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(auction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ends</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(auction.end_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Winner Info for ended auctions */}
                    {auction.status === 'ended' && auction.winner_id && (
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-2">Auction Winner</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            {auction.winner_username?.charAt(0) || 'W'}
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">@{auction.winner_username || 'Unknown'}</p>
                            <p className="text-sm text-purple-700">
                              Won for ₱{formatPrice(auction.final_price || auction.current_price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    {auction.media?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Images ({auction.media.length})</p>
                        <div className={`grid gap-3 ${
                          auction.media.length === 1 ? "grid-cols-1" : 
                          auction.media.length === 2 ? "grid-cols-2" : 
                          "grid-cols-2 md:grid-cols-3"
                        }`}>
                          {auction.media.map((file, index) => (
                            <div
                              key={file.id}
                              className="relative aspect-square cursor-pointer group"
                              onClick={() => setSelectedMedia(file)}
                            >
                              <img
                                src={`${API_BASE}/uploads/${file.media_path}`}
                                alt="Auction media"
                                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Filter sidebar */}
      <div className="lg:w-64">
        <div className="sticky top-4 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sorting</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <SortAsc size={16} /> Sort by
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="latest">Latest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} /> Filter by year
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="w-full flex items-center justify-between gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
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

          {/* Quick Stats */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h4>
            <div className="space-y-3">
              {[
                { label: 'Active', count: filteredAuctions.filter(a => a.status === 'active').length, color: 'bg-green-100 text-green-700' },
                { label: 'With Increments', count: filteredAuctions.filter(a => a.use_increment === 1).length, color: 'bg-purple-100 text-purple-700' },
                { label: 'Ended', count: filteredAuctions.filter(a => a.status === 'ended').length, color: 'bg-blue-100 text-blue-700' },
                { label: 'Draft/Pending', count: filteredAuctions.filter(a => a.status === 'draft' || a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.color}`}>
                    {stat.count}
                  </span>
                </div>
              ))}
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
            className="relative max-w-4xl w-full max-h-[90vh]"
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
              src={`${API_BASE}/uploads/${selectedMedia.media_path}`}
              alt="Auction preview"
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnAuct;