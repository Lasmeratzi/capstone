import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin"; // Sidebar for admin navigation

const DisplayProfile = () => {
  const [profiles, setProfiles] = useState([]); // User profiles
  const [searchTerm, setSearchTerm] = useState(""); // Search term for profiles

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

  // Update account status in the backend
  const updateStatus = (id, newStatus) => {
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
  };

  // Handle search input
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filter profiles by search term
  const filteredProfiles = profiles.filter((profile) =>
    profile.username.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <SideAdmin /> {/* Sidebar for navigation */}
      <div className="flex-grow p-6">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Profiles</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Search Section */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <label htmlFor="search" className="block text-sm text-gray-600">
            Search Profiles
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter username"
          />
        </div>

        {/* Profiles Table */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="table-auto w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Full Name</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Birthdate</th>
                <th className="border border-gray-300 px-4 py-2">Account Status</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-4 py-2">Updated At</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{profile.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{profile.fullname}</td>
                  <td className="border border-gray-300 px-4 py-2">{profile.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{profile.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(profile.birthdate)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        profile.account_status === "active"
                          ? "bg-green-100 text-green-800"
                          : profile.account_status === "on hold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.account_status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(profile.created_at)}</td>
                  <td className="border border-gray-300 px-4 py-2">{profile.updated_at}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {profile.account_status === "active" && (
                      <>
                        <button
                          onClick={() => updateStatus(profile.id, "on hold")}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Put on Hold
                        </button>
                        <button
                          onClick={() => updateStatus(profile.id, "banned")}
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Ban
                        </button>
                      </>
                    )}
                    {profile.account_status === "on hold" && (
                      <>
                        <button
                          onClick={() => updateStatus(profile.id, "active")}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => updateStatus(profile.id, "banned")}
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Ban
                        </button>
                      </>
                    )}
                    {profile.account_status === "banned" && (
                      <>
                        <button
                          onClick={() => updateStatus(profile.id, "active")}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => updateStatus(profile.id, "on hold")}
                          className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Put on Hold
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;