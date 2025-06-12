import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DisplayAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch auctions on mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        if (!token) {
          console.error("No admin token found.");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/admin/auctions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };
    fetchAuctions();
  }, []);

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Update auction status helper
  const updateAuctionStatus = (id, status, successMsg, failMsg) => {
    const token = sessionStorage.getItem("adminToken");
    axios
      .put(
        `http://localhost:5000/api/auctions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setAuctions(
          auctions.map((auction) =>
            auction.id === id ? { ...auction, status } : auction
          )
        );
        alert(successMsg);
      })
      .catch(() => alert(failMsg));
  };

  // Handlers for each action
  const approveAuction = (id) =>
    updateAuctionStatus(id, "approved", "Auction approved!", "Failed to approve auction.");

  const rejectAuction = (id) =>
    updateAuctionStatus(id, "rejected", "Auction rejected!", "Failed to reject auction.");

  const activateAuction = (id) =>
    updateAuctionStatus(id, "active", "Auction activated!", "Failed to activate auction.");

  const stopAuction = (id) =>
    updateAuctionStatus(id, "stopped", "Auction stopped!", "Failed to stop auction.");

  // Image modal handlers
  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Search input handler
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filter auctions by title matching search term
  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <SideAdmin />
      <div className="flex-grow p-6">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Auctions</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <label htmlFor="search" className="block text-sm text-gray-600">Search Auctions</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter auction title"
          />
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg overflow-auto max-h-[70vh]">
          <table className="table-auto w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Author</th>
                <th className="border border-gray-300 px-4 py-2">Current Price</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">End Time</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{auction.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{auction.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{auction.author_username}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{auction.current_price}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        auction.status === "active"
                          ? "bg-green-100 text-green-800"
                          : auction.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : auction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : auction.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : auction.status === "stopped"
                          ? "bg-gray-300 text-gray-700"
                          : auction.status === "ended"
                          ? "bg-gray-400 text-gray-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {auction.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(auction.end_time)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center flex gap-3">
                    {auction.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveAuction(auction.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-1"
                        >
                          <CheckIcon className="w-5 h-5" /> Approve
                        </button>
                        <button
                          onClick={() => rejectAuction(auction.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1"
                        >
                          <XMarkIcon className="w-5 h-5" /> Reject
                        </button>
                      </>
                    )}

                    {auction.status === "approved" && (
                      <>
                        <button
                          onClick={() => activateAuction(auction.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => stopAuction(auction.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                        >
                          Stop
                        </button>
                      </>
                    )}

                    {auction.status === "active" && (
                      <button
                        onClick={() => stopAuction(auction.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                      >
                        Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image Modal placeholder */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={closeImageModal}
          >
            <img src={selectedImage} alt="Auction" className="max-h-[80vh] rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayAuctions;
