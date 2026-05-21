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
          <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Total Auctions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredAuctions.length}</p>
          </div>
          
          <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
              {filteredAuctions.filter(a => a.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">With Increments</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">
              {filteredAuctions.filter(a => a.use_increment === 1).length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#0A0A0B] p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Ended</p>
            <p className="text-2xl font-bold text-[#5E66FF]">
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
          <div className="text-center py-12 bg-white dark:bg-[#0A0A0B] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No auctions found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">You haven't created any auctions yet.</p>
            </div>
          </div>
        ) : (
          filteredAuctions.map((auction) => {
            const statusBadge = getStatusBadge(auction.status);
            const useIncrement = auction.use_increment === 1;
            const bidIncrement = auction.bid_increment || 100;

            const getImagePath = (path) => {
              if (!path) return "";
              const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
              return `${API_BASE}/uploads/${cleanPath}`;
            };
            
            return (
              <div key={auction.id} className="bg-white dark:bg-[#161B22] rounded-xl shadow-md border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {auction.author_pfp ? (
                        <img
                          src={`${API_BASE}/uploads/${auction.author_pfp}`}
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
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800/30">
                          <Calculator size={12} />
                          <span>₱{formatPrice(bidIncrement)} increment</span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.bg} ${statusBadge.text} dark:bg-opacity-20`}>
                        {statusBadge.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
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
                            src={getImagePath(auction.media[0].media_path)}
                            alt={auction.title}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                          {auction.media.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                              +{auction.media.length - 1} more
                            </div>
                          )}
                        </div>
                        {/* Thumbnails if multiple */}
                        {auction.media.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {auction.media.slice(1, 4).map((file, idx) => (
                              <div 
                                key={file.id} 
                                className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 cursor-pointer transition"
                                onClick={() => setSelectedMedia(file)}
                              >
                                <img
                                  src={getImagePath(file.media_path)}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {auction.media.length > 4 && (
                              <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500">
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
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{auction.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{auction.description}</p>
                      </div>

                      {/* Price Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Starting Price</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">₱{formatPrice(auction.starting_price)}</p>
                        </div>
                        
                        <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">Current Price</p>
                          <p className="text-lg font-bold text-green-900 dark:text-green-100">₱{formatPrice(auction.current_price)}</p>
                        </div>
                        
                        <div className={`sm:col-span-2 p-3 rounded-xl border ${
                          useIncrement 
                            ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20'
                            : 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5'
                        }`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${useIncrement ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                            {useIncrement ? 'Bid Increment' : 'Bidding Rules'}
                          </p>
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
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Created</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {new Date(auction.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ends</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {new Date(auction.end_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Winner Info */}
                      {auction.status === 'ended' && auction.winner_id && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-xl border border-purple-500/20">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">Auction Winner</p>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {auction.winner_username?.charAt(0) || 'W'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">@{auction.winner_username || 'Unknown'}</p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">
                                Won for ₱{formatPrice(auction.final_price || auction.current_price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Filter Sidebar */}
      <div className="lg:w-64">
        <div className="sticky top-4 space-y-4">
          <div className="bg-white dark:bg-[#0A0A0B] p-5 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-5">Filters & Sorting</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <SortAsc size={16} /> Sort by
                </label>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]/50 appearance-none cursor-pointer transition-all"
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={16} /> Filter by year
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="w-full flex items-center justify-between gap-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    {yearFilter === "all" ? "All years" : yearFilter}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${showYearDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showYearDropdown && (
                    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden overflow-y-auto max-h-60">
                      <button
                        onClick={() => {
                          setYearFilter("all");
                          setShowYearDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                          yearFilter === "all" ? "text-[#5E66FF] font-bold" : "text-gray-600 dark:text-gray-400"
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
                          className={`block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                            yearFilter === year.toString() ? "text-[#5E66FF] font-bold" : "text-gray-600 dark:text-gray-400"
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

          {/* Quick Stats Sidebar */}
          <div className="bg-white dark:bg-[#0A0A0B] border border-gray-100 dark:border-white/5 rounded-lg p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-5">Auction Status</h4>
            <div className="space-y-4">
              {[
                { label: 'Active', count: filteredAuctions.filter(a => a.status === 'active').length, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
                { label: 'With Increments', count: filteredAuctions.filter(a => a.use_increment === 1).length, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
                { label: 'Ended', count: filteredAuctions.filter(a => a.status === 'ended').length, color: 'bg-blue-100 text-[#5E66FF] dark:bg-blue-900/20 dark:text-[#5E66FF]' },
                { label: 'Draft/Pending', count: filteredAuctions.filter(a => a.status === 'draft' || a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{stat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.color}`}>
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
              src={selectedMedia.media_path.includes('http') ? selectedMedia.media_path : `${API_BASE}/uploads/${selectedMedia.media_path.replace(/^\/+/, '').replace(/^uploads\//, '')}`}
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