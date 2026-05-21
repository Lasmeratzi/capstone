import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { Link } from "react-router-dom";

const HomeAdmin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    onHoldUsers: 0,
    bannedUsers: 0,
    activeAuctions: 0,
    totalPosts: 0,
    pendingVerifications: 0,
    verifiedUsers: 0,
    openCommissions: 0,
    auctionStats: {
      totalAuctions: 0,
      endingSoon: 0,
      totalRevenue: 0,
      completedAuctions: 0,
      pendingPayment: 0,
      draftAuctions: 0,
      approvedAuctions: 0,
      endedAuctions: 0
    }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationStats, setLocationStats] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    mostActiveTime: null,
    popularTags: [],
    avgPostsPerUser: 0
  });

  useEffect(() => {
    fetchDashboardData();
    fetchLocationData();
  }, []);

  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);

    try {
      // Use the new comprehensive dashboard stats endpoint
      const response = await axios.get("http://localhost:5000/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      
      console.log("Dashboard data fetched:", data);

      setStats({
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        onHoldUsers: data.onHoldUsers || 0,
        bannedUsers: data.bannedUsers || 0,
        activeAuctions: data.activeAuctions || 0,
        totalPosts: data.totalPosts || 0,
        pendingVerifications: data.pendingVerifications || 0,
        verifiedUsers: data.verifiedUsers || 0,
        openCommissions: data.openCommissions || 0,
        auctionStats: data.auctionStats || {
          totalAuctions: 0,
          endingSoon: 0,
          totalRevenue: 0,
          completedAuctions: 0,
          pendingPayment: 0,
          draftAuctions: 0,
          approvedAuctions: 0,
          endedAuctions: 0
        }
      });

      setRecentActivities(data.recentActivities || []);
      
      // Update platform stats based on real data
      setPlatformStats({
        mostActiveTime: data.mostActiveTime || null,
        popularTags: data.popularTags || [],
        avgPostsPerUser: data.totalUsers > 0 ? (data.totalPosts / data.totalUsers).toFixed(1) : 0
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Show empty state — no mock data
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    const token = sessionStorage.getItem("adminToken");
    setLoadingLocations(true);

    try {
      // Fetch locations with artist counts
      const locationsResponse = await axios.get("http://localhost:5000/api/locations/with-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Locations data:", locationsResponse.data);
      
      if (locationsResponse.data && locationsResponse.data.locations) {
        const locations = locationsResponse.data.locations;
        
        // Filter locations with artists and sort by artist count
        const sortedLocations = locations
          .filter(loc => loc.artist_count > 0)
          .sort((a, b) => b.artist_count - a.artist_count)
          .slice(0, 5); // Top 5 locations
        
        // Calculate percentages
        const totalArtists = sortedLocations.reduce((sum, loc) => sum + loc.artist_count, 0);
        const locationStatsWithPercentage = sortedLocations.map(loc => ({
          id: loc.id,
          name: loc.name,
          province: loc.province,
          artistCount: loc.artist_count,
          percentage: totalArtists > 0 ? Math.round((loc.artist_count / totalArtists) * 100) : 0
        }));
        
        setLocationStats(locationStatsWithPercentage);
      }
      
    } catch (error) {
      console.error("Error fetching location data:", error);
      // Show empty state — no mock data
    } finally {
      setLoadingLocations(false);
    }
  };



  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        return `${diffDays}d ago`;
      }
    } catch (error) {
      return "Recently";
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₱0';
    return `₱${parseFloat(amount).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get color for location bar
  const getLocationBarColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  // Get full location name (city, province)
  const getFullLocationName = (location) => {
    if (location.province && location.name !== location.province) {
      return `${location.name}, ${location.province}`;
    }
    return location.name;
  };

  // Calculate total artists from all locations
  const getTotalArtistsFromLocations = () => {
    return locationStats.reduce((total, loc) => total + loc.artistCount, 0);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideAdmin />

      {/* Main Content */}
      <div className="flex-grow p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with Illura today.</p>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Stats Grid - 2x2 layout for better balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Total</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {loading ? '...' : formatNumber(stats.totalUsers)}
              </h2>
              <p className="text-sm text-gray-600">Registered Users</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">{stats.activeUsers} active</span>
                  <span className="text-yellow-600">{stats.onHoldUsers} on hold</span>
                  <span className="text-red-600">{stats.bannedUsers} banned</span>
                </div>
              </div>
            </div>

            {/* Active Auctions Card - Updated with real data */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Live</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {loading ? '...' : formatNumber(stats.activeAuctions)}
              </h2>
              <p className="text-sm text-gray-600">Active Auctions</p>
              
              {/* Show ending soon auctions if available */}
              {stats.auctionStats?.endingSoon > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {stats.auctionStats.endingSoon} ending in 24h
                  </span>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Total: {formatNumber(stats.auctionStats.totalAuctions)}</span>
                  <span>Ended: {formatNumber(stats.auctionStats.endedAuctions)}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to="/displayauctions" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all auctions →
                </Link>
              </div>
            </div>

            {/* Verified Users Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Verified</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {loading ? '...' : formatNumber(stats.verifiedUsers)}
              </h2>
              <p className="text-sm text-gray-600">Verified Accounts</p>
              <div className="mt-4">
                <div className="text-xs text-gray-500">
                  {stats.totalUsers > 0 ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% of total users` : 'No users'}
                </div>
              </div>
            </div>

            {/* Pending Verifications Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Pending</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {loading ? '...' : formatNumber(stats.pendingVerifications)}
              </h2>
              <p className="text-sm text-gray-600">Verifications</p>
              <div className="mt-4">
                <Link to="/verifyprofile" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Review requests →
                </Link>
              </div>
            </div>
          </div>

          {/* Two-column layout for middle sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions & Auction Stats - Takes 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Quick Actions & Auction Insights</h2>
                  <button
                    onClick={fetchDashboardData}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Refresh"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Link
                    to="/displayprofile"
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 5.197a41.76 41.76 0 00-5.838-3.956" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Manage Users</h3>
                        <p className="text-sm text-gray-600">View and manage all user accounts</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/displayposts"
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Manage Posts</h3>
                        <p className="text-sm text-gray-600">Review and moderate posts</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/displayauctions"
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-100"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Manage Auctions</h3>
                        <p className="text-sm text-gray-600">Oversee active auctions</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/verifyprofile"
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Verify Artists</h3>
                        <p className="text-sm text-gray-600">Review verification requests</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Auction Statistics Row */}
                
              </div>
            </div>

            {/* Recent Activities - Takes 1/3 width */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
                <button
                  onClick={fetchDashboardData}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title="Refresh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {/* No icon */}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No recent activities</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to="/admin/activities" className="text-sm text-blue-600 hover:text-blue-800 font-medium block text-center">
                  View all activities →
                </Link>
              </div>
            </div>
          </div>

          {/* Location Insights & Platform Statistics Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Platform Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Artist Locations */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Top Artist Locations
                  </h3>
                  <button
                    onClick={fetchLocationData}
                    className="text-sm text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                    disabled={loadingLocations}
                  >
                    {loadingLocations ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
                
                {loadingLocations ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : locationStats.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {locationStats.map((location, index) => (
                        <div key={location.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                {getFullLocationName(location)}
                              </span>
                              <div className="text-xs text-gray-500">
                                {location.province}
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {location.artistCount} artists ({location.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getLocationBarColor(index)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${Math.max(location.percentage, 5)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{getFullLocationName(locationStats[0])}</span> has the highest concentration of artists with{" "}
                        <span className="font-medium">{locationStats[0]?.artistCount}</span> registered users.
                        {getTotalArtistsFromLocations() > 0 && (
                          <span> That's {locationStats[0]?.percentage}% of all located artists.</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No location data available</p>
                    <p className="text-xs text-gray-400 mt-1">Users haven't set their locations yet</p>
                  </div>
                )}
              </div>

              {/* Platform Statistics */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Platform Statistics
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Most Active Time</span>
                      <span className="text-sm font-semibold text-blue-600">{platformStats.mostActiveTime || 'No data yet'}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Users are most active during this time period for posting and bidding.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Average Posts per User</span>
                      <span className="text-sm font-semibold text-green-600">{platformStats.avgPostsPerUser}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Each user posts an average of {platformStats.avgPostsPerUser} artworks.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Popular Art Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {platformStats.popularTags.length > 0 ? platformStats.popularTags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      )) : (
                        <span className="text-xs text-gray-400">No tags used yet</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {platformStats.popularTags.length > 0 ? 'These are the most commonly used tags by artists.' : 'Tags will appear here once artists start tagging their work.'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>
                      {platformStats.mostActiveTime ? `Platform engagement is highest during ${platformStats.mostActiveTime.toLowerCase()}.` : 'Not enough activity data to determine peak times.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default HomeAdmin;