import React, { useEffect, useState } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin"; // Import SideAdmin for the admin sidebar

const ProfileDisplay = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering profiles
  const [dateFilter, setDateFilter] = useState("Latest"); // Dropdown for date filter

  useEffect(() => {
    // Fetch registered accounts
    axios
      .get("http://localhost:5000/api/signup") // Adjust endpoint if needed
      .then((response) => {
        setProfiles(response.data);
      })
      .catch((err) => {
        console.error("Error fetching profiles:", err.response || err.message);
        setError("Failed to fetch profiles. Please try again later.");
      });
  }, []);

  const toggleAccountStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "on_hold" : "active";
    axios
      .put(`http://localhost:5000/api/signup/${id}/status`, { account_status: newStatus })
      .then((response) => {
        setProfiles(
          profiles.map((profile) =>
            profile.id === id ? { ...profile, account_status: newStatus } : profile
          )
        );
        alert(`Account with ID: ${id} is now ${newStatus === "active" ? "Active" : "On Hold"}.`);
      })
      .catch((err) => {
        console.error("Error updating account status:", err.response || err.message);
        alert("Failed to update account status. Please try again.");
      });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDateFilterChange = (e) => setDateFilter(e.target.value);

  const filteredProfiles = [...profiles]
    .filter((profile) =>
      `${profile.fullname} ${profile.username} ${profile.email}`.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (dateFilter === "Latest") {
        return new Date(b.created_at) - new Date(a.created_at); // Descending order
      } else if (dateFilter === "Oldest") {
        return new Date(a.created_at) - new Date(b.created_at); // Ascending order
      }
      return 0;
    });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideAdmin />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Profiles</h1>
          <hr className="border-t border-gray-300 mt-2" /> {/* Horizontal line */}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6 flex items-center space-x-4">
          <div>
            <label htmlFor="search" className="block text-sm text-gray-600">
              Search Profiles
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter keyword"
            />
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-sm text-gray-600">
              Filter By
            </label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-md font-medium text-gray-700 mb-4">Registered Accounts</h2>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredProfiles.length > 0 ? (
            <table className="table-auto w-full text-left border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">ID</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                    Full Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                    Birthdate
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-600 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{profile.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{profile.fullname}</td>
                    <td className="border border-gray-300 px-4 py-2">{profile.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{profile.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{profile.birthdate}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center justify-start gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          profile.account_status === "active"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></span>
                      {profile.account_status === "on_hold" ? "On Hold" : "Active"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => toggleAccountStatus(profile.id, profile.account_status)}
                        className={`${
                          profile.account_status === "active"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white px-3 py-1 rounded`}
                      >
                        {profile.account_status === "active" ? "Put on Hold" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-4">No registered accounts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;