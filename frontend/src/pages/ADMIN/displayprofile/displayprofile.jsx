import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin"; // Sidebar for admin navigation

const DisplayProfile = () => {
  const [profiles, setProfiles] = useState([]); // User profiles
  const [searchTerm, setSearchTerm] = useState(""); // Search term for profiles
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Show 5 users per page

  // Fetch profiles on component load
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }, // Include Authorization header
      })
      .then((response) => setProfiles(response.data))
      .catch(() => alert("Failed to fetch profiles. Check your backend setup."));
  }, []);

  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update account status in the backend with confirmation
  const updateStatus = (id, newStatus, username) => {
    const action = newStatus === "banned" ? "ban" : 
                   newStatus === "on hold" ? "put on hold" : "activate";
    
    if (window.confirm(`Are you sure you want to ${action} ${username}?`)) {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      axios
        .patch(
          `http://localhost:5000/api/users/${id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } } // Include Authorization header
        )
        .then(() => {
          setProfiles(
            profiles.map((profile) =>
              profile.id === id ? { ...profile, account_status: newStatus } : profile
            )
          );
          alert(`Account status updated to ${newStatus}!`);
        })
        .catch(() => alert("Failed to update account status. Please try again."));
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter profiles by search term
  const filteredProfiles = profiles.filter((profile) =>
    profile.username.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredProfiles.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredProfiles.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const activeUsers = profiles.filter(p => p.account_status === 'active').length;
  const onHoldUsers = profiles.filter(p => p.account_status === 'on hold').length;
  const bannedUsers = profiles.filter(p => p.account_status === 'banned').length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <SideAdmin />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow p-6 ml-48"> {/* Adjust ml-48 based on your sidebar width */}
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Profiles</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">{onHoldUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banned</p>
                <p className="text-2xl font-bold text-gray-900">{bannedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <label htmlFor="search" className="block text-sm text-gray-600 mb-2">
            Search Profiles
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter username"
          />
        </div>

        {/* Profiles Table */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              User Profiles ({filteredProfiles.length} users found)
            </h2>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">ID</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Full Name</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Username</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Email</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Birthdate</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Account Status</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold">Created At</th>
                  <th className="border border-gray-300 px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-600">{profile.id}</td>
                    <td className="px-4 py-3 font-medium">{profile.fullname}</td>
                    <td className="px-4 py-3 text-blue-600">@{profile.username}</td>
                    <td className="px-4 py-3">{profile.email}</td>
                    <td className="px-4 py-3">{formatDate(profile.birthdate)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          profile.account_status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : profile.account_status === "on hold"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {profile.account_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(profile.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        {profile.account_status === "active" && (
                          <>
                            <button
                              onClick={() => updateStatus(profile.id, "on hold", profile.username)}
                              className="px-4 py-2 bg-transparent text-yellow-600 border border-yellow-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-yellow-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Hold
                            </button>
                            <button
                              onClick={() => updateStatus(profile.id, "banned", profile.username)}
                              className="px-4 py-2 bg-transparent text-red-600 border border-red-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Ban
                            </button>
                          </>
                        )}
                        {profile.account_status === "on hold" && (
                          <>
                            <button
                              onClick={() => updateStatus(profile.id, "active", profile.username)}
                              className="px-4 py-2 bg-transparent text-green-600 border border-green-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-green-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Activate
                            </button>
                            <button
                              onClick={() => updateStatus(profile.id, "banned", profile.username)}
                              className="px-4 py-2 bg-transparent text-red-600 border border-red-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Ban
                            </button>
                          </>
                        )}
                        {profile.account_status === "banned" && (
                          <>
                            <button
                              onClick={() => updateStatus(profile.id, "active", profile.username)}
                              className="px-4 py-2 bg-transparent text-green-600 border border-green-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-green-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Activate
                            </button>
                            <button
                              onClick={() => updateStatus(profile.id, "on hold", profile.username)}
                              className="px-4 py-2 bg-transparent text-yellow-600 border border-yellow-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-yellow-600 hover:text-white transition text-sm font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Hold
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredProfiles.length)} of {filteredProfiles.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;