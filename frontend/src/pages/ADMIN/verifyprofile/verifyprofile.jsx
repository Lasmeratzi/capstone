import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { CheckIcon, XMarkIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';

const VerifyProfile = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = sessionStorage.getItem("adminToken");
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/verifyrequests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await axios.put(
        `http://localhost:5000/api/verifyrequests/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh the list after action
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleApprove = async (id) => {
  const token = sessionStorage.getItem("adminToken");
  try {
    await axios.put(
      `http://localhost:5000/api/verifyrequests/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRequests(); // Refresh list after approval
  } catch (error) {
    console.error("Error approving request:", error);
    alert("Failed to approve request.");
  }
};


  const handleDelete = async (id) => {
  const token = sessionStorage.getItem("adminToken");
  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/verifyrequests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests(); // Refresh list
  } catch (error) {
    console.error("Error deleting request:", error);
    alert("Failed to delete request.");
  }
};



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredRequests = requests.filter((req) => 
  req.user_id.toString().includes(searchTerm) ||
  (req.username && req.username.toLowerCase().includes(searchTerm)) || 
  (req.twitter_link && req.twitter_link.toLowerCase().includes(searchTerm)) ||
  (req.instagram_link && req.instagram_link.toLowerCase().includes(searchTerm)) ||
  (req.facebook_link && req.facebook_link.toLowerCase().includes(searchTerm))
);


  return (
    <div className="flex h-screen bg-gray-100">
      <SideAdmin />
      <div className="flex-grow p-6">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-800">Verification Requests</h1>
          <p className="text-gray-600">Manage artist verification requests</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <label htmlFor="search" className="block text-sm text-gray-600">Search Requests</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Search by user or link"
          />
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg overflow-auto max-h-[70vh]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No verification requests found
            </div>
          ) : (
            <table className="table-auto w-full text-left border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">User ID</th>
                  <th className="border border-gray-300 px-4 py-2">Username</th>
                  <th className="border border-gray-300 px-4 py-2">Social Links</th>
                  <th className="border border-gray-300 px-4 py-2">Request Date</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{req.user_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{req.username}</td>
                    <td className="border border-gray-300 px-4 py-2">
                    <div className="space-y-1">
                        <div className="space-y-1">
                            {req.twitter_link && (
                            <div className="text-gray-900 flex items-center">
                                <a
                                href={req.twitter_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline flex items-center"
                                >
                                <FaXTwitter className="mr-1" />
                                {req.twitter_link}
                                </a>
                            </div>
                            )}
                        </div>
                        {req.instagram_link && (
                        <div className="text-pink-600 flex items-center">
                            <a
                            href={req.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline flex items-center"
                            >
                            <FaInstagram className="mr-1" />
                            {req.instagram_link}
                            </a>
                        </div>
                        )}
                        {req.facebook_link && (
                        <div className="text-blue-800 flex items-center">
                            <a
                            href={req.facebook_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline flex items-center"
                            >
                            <FaFacebook className="mr-1" />
                            {req.facebook_link}
                            </a>
                        </div>
                        )}
                    </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(req.request_date)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-lg text-sm ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {req.status === "pending" ? (
    <div className="flex gap-3">
      <button
  onClick={() => handleApprove(req.id)}
  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-1"
>
  <CheckIcon className="w-5 h-5" /> Approve
</button>

      <button
        onClick={() => handleAction(req.id, "rejected")}
        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1"
      >
        <XMarkIcon className="w-5 h-5" /> Reject
      </button>
    </div>
  ) : (
    <div className="text-gray-400">Action completed</div>
  )}

  <button
    onClick={() => handleDelete(req.id)}
    className="mt-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm"
  >
    Delete
  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyProfile;