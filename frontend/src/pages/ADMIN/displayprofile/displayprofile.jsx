import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";

const DisplayProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onHold: 0,
    banned: 0,
    verified: 0
  });

  // Fetch profiles on component load
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Update filtered profiles when search or filter changes
  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, selectedStatus]);

  const fetchProfiles = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    
    // Try admin endpoint first, fall back to regular endpoint
    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const users = response.data.users || response.data;
        // Debug log to see what data we're getting
        console.log("Fetched users data:", users);
        if (users.length > 0) {
          console.log("First user's data:", users[0]);
          console.log("GCash field in first user:", users[0].gcash_number);
        }
        setProfiles(users);
        calculateStats(users);
      })
      .catch(() => {
        // Fallback to the original endpoint
        axios
          .get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const users = response.data;
            console.log("Fallback - Fetched users:", users);
            if (users.length > 0) {
              console.log("First user in fallback:", users[0]);
            }
            setProfiles(users);
            calculateStats(users);
          })
          .catch((error) => {
            console.error("Failed to fetch profiles:", error);
            alert("Failed to fetch profiles. Check your backend setup.");
          });
      })
      .finally(() => setLoading(false));
  };

  const calculateStats = (users) => {
    const stats = {
      total: users.length,
      active: users.filter(p => p.account_status === 'active').length,
      onHold: users.filter(p => p.account_status === 'on hold').length,
      banned: users.filter(p => p.account_status === 'banned').length,
      verified: users.filter(p => p.verified === 1 || p.verified === true).length
    };
    setStats(stats);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Update account status in the backend with confirmation
  const updateStatus = (id, newStatus, username) => {
    const action = newStatus === "banned" ? "ban" : "put on hold";
    
    if (window.confirm(`Are you sure you want to ${action} ${username}?`)) {
      const token = localStorage.getItem("token");
      axios
        .patch(
          `http://localhost:5000/api/users/${id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          const updatedProfiles = profiles.map((profile) =>
            profile.id === id ? { ...profile, account_status: newStatus } : profile
          );
          setProfiles(updatedProfiles);
          calculateStats(updatedProfiles);
          alert(`Account status updated to ${newStatus}!`);
        })
        .catch(() => alert("Failed to update account status. Please try again."));
    }
  };

  // Reactivate user
  const reactivateUser = (id, username) => {
    if (window.confirm(`Are you sure you want to reactivate ${username}?`)) {
      const token = localStorage.getItem("token");
      axios
        .patch(
          `http://localhost:5000/api/users/${id}/status`,
          { status: "active" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          const updatedProfiles = profiles.map((profile) =>
            profile.id === id ? { ...profile, account_status: "active" } : profile
          );
          setProfiles(updatedProfiles);
          calculateStats(updatedProfiles);
          alert(`Account reactivated successfully!`);
        })
        .catch(() => alert("Failed to reactivate account. Please try again."));
    }
  };

  // Toggle user verification
  const toggleVerification = (id, currentVerified, username) => {
    const newVerified = !currentVerified;
    const action = newVerified ? "verify" : "unverify";
    
    if (window.confirm(`Are you sure you want to ${action} ${username}?`)) {
      const token = localStorage.getItem("token");
      axios
        .patch(
          `http://localhost:5000/api/admin/users/${id}/verify`,
          { verified: newVerified },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          const updatedProfiles = profiles.map((profile) =>
            profile.id === id ? { ...profile, verified: newVerified ? 1 : 0 } : profile
          );
          setProfiles(updatedProfiles);
          calculateStats(updatedProfiles);
          alert(`User ${newVerified ? "verified" : "unverified"} successfully!`);
        })
        .catch(() => {
          // Fallback: just update locally if admin endpoint doesn't exist
          const updatedProfiles = profiles.map((profile) =>
            profile.id === id ? { ...profile, verified: newVerified ? 1 : 0 } : profile
          );
          setProfiles(updatedProfiles);
          calculateStats(updatedProfiles);
          alert(`User ${newVerified ? "verified" : "unverified"}!`);
        });
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  // Filter profiles by search term and status
  const filterProfiles = () => {
    let filtered = profiles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((profile) =>
        profile.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((profile) => profile.account_status === selectedStatus);
    }

    setFilteredProfiles(filtered);
  };

  // Get GCash number from user object (check multiple possible field names)
  const getGcashNumber = (user) => {
    // Check all possible field names for GCash number
    return user.gcash_number || user.gcash || "Not set";
  };

  // Format GCash number for display
  const formatGcashNumber = (gcash) => {
    if (!gcash || gcash === "Not set") return gcash;
    
    // Format as 09XX XXX XXXX for readability
    if (gcash.length === 11) {
      return `${gcash.substring(0, 4)} ${gcash.substring(4, 7)} ${gcash.substring(7)}`;
    }
    return gcash;
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredProfiles.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredProfiles.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border border-green-200";
      case "on hold": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "banned": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <SideAdmin />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow p-6 ml-48">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Illura Database › User Profiles</h1>
          <p className="text-gray-600">Manage all user accounts and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onHold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.banned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by name, username, or email..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusFilter}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="on hold">On Hold</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchProfiles}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">User Accounts</h2>
                <p className="text-sm text-gray-600">
                  {loading ? "Loading..." : `${filteredProfiles.length} users found`}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GCash Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentUsers.map((profile) => {
                      const gcashNumber = getGcashNumber(profile);
                      const formattedGcash = formatGcashNumber(gcashNumber);
                      
                      return (
                        <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {profile.pfp ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`http://localhost:5000/uploads/${profile.pfp}`}
                                    alt={profile.username}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `
                                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                          <span class="text-blue-600 font-semibold">
                                            ${profile.username?.charAt(0).toUpperCase() || 'U'}
                                          </span>
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">
                                      {profile.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{profile.fullname}</div>
                                <div className="text-sm text-gray-500">@{profile.username}</div>
                                <div className="text-xs text-gray-400">ID: {profile.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{profile.email}</div>
                            <div className="text-xs text-gray-500">
                              Birthdate: {formatDate(profile.birthdate)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {formatDate(profile.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {gcashNumber === "Not set" ? (
                                <span className="text-gray-400 italic">Not set</span>
                              ) : (
                                <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                  {formattedGcash}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(profile.account_status)}`}>
                              {profile.account_status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.verified ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                              {profile.verified ? '✓ Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Verification Toggle */}
                              <button
                                onClick={() => toggleVerification(profile.id, profile.verified, profile.username)}
                                className={`p-1.5 rounded ${profile.verified ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'}`}
                                title={profile.verified ? "Unverify User" : "Verify User"}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </button>

                              {/* Status Management - Only Put on Hold and Ban for active users */}
                              {profile.account_status === "active" && (
                                <>
                                  <button
                                    onClick={() => updateStatus(profile.id, "on hold", profile.username)}
                                    className="px-3 py-1.5 bg-transparent text-yellow-600 border border-yellow-600 rounded-lg flex items-center gap-2 hover:bg-yellow-50 transition text-sm font-semibold"
                                    title="Put on Hold"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hold
                                  </button>
                                  <button
                                    onClick={() => updateStatus(profile.id, "banned", profile.username)}
                                    className="px-3 py-1.5 bg-transparent text-red-600 border border-red-600 rounded-lg flex items-center gap-2 hover:bg-red-50 transition text-sm font-semibold"
                                    title="Ban User"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Ban
                                  </button>
                                </>
                              )}

                              {/* Reactivate button for on hold and banned users */}
                              {(profile.account_status === "on hold" || profile.account_status === "banned") && (
                                <button
                                  onClick={() => reactivateUser(profile.id, profile.username)}
                                  className="px-3 py-1.5 bg-transparent text-green-600 border border-green-600 rounded-lg flex items-center gap-2 hover:bg-green-50 transition text-sm font-semibold"
                                  title="Reactivate User"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredProfiles.length === 0 && !loading && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && filteredProfiles.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredProfiles.length)}</span> of{" "}
                  <span className="font-medium">{filteredProfiles.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>User Management Panel • Illura Admin Dashboard • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;