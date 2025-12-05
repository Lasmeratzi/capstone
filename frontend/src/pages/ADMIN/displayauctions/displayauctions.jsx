import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { CheckIcon, XMarkIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline";

const DisplayAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(5);

  // Fetch auctions on mount
  useEffect(() => {
    const fetchAuctions = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      console.error("No admin token found.");
      return;
    }
    console.log("🔍 Fetching auctions with token:", token.substring(0, 20) + "...");
    
    const res = await axios.get("http://localhost:5000/api/admin/auctions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Auctions fetched:", res.data.length, "auctions");
    setAuctions(res.data);
  } catch (error) {
    console.error("❌ Error fetching auctions:");
    console.error("Full error object:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Headers:", error.response?.headers);
  }
};
    fetchAuctions();
  }, []);

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Update auction status helper with confirmation
  const updateAuctionStatus = (id, status, successMsg, failMsg, auctionTitle) => {
    const action = status === "approved" ? "approve" : 
                   status === "rejected" ? "reject" : 
                   status === "active" ? "activate" : "stop";
    
    if (window.confirm(`Are you sure you want to ${action} the auction "${auctionTitle}"?`)) {
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
    }
  };

  // Handlers for each action
  const approveAuction = (id, title) =>
    updateAuctionStatus(id, "approved", "Auction approved!", "Failed to approve auction.", title);

  const rejectAuction = (id, title) =>
    updateAuctionStatus(id, "rejected", "Auction rejected!", "Failed to reject auction.", title);

  const activateAuction = (id, title) =>
    updateAuctionStatus(id, "active", "Auction activated!", "Failed to activate auction.", title);

  const stopAuction = (id, title) =>
    updateAuctionStatus(id, "stopped", "Auction stopped!", "Failed to stop auction.", title);

  // Payment verification function
  const verifyPayment = async (auctionId, status, auctionTitle) => {
    if (window.confirm(`Are you sure you want to mark payment as ${status} for auction "${auctionTitle}"?`)) {
      try {
        const token = sessionStorage.getItem("adminToken");
        
        // Get payment details for this auction
        const paymentRes = await axios.get(
          `http://localhost:5000/api/payments/auction/${auctionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (paymentRes.data.payment) {
          const paymentId = paymentRes.data.payment.id;
          
          // Update payment status
          await axios.put(
            `http://localhost:5000/api/payments/admin/verify/${paymentId}`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Refresh auctions list
          const res = await axios.get("http://localhost:5000/api/admin/auctions", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAuctions(res.data);
          
          alert(`Payment marked as ${status} successfully.`);
        } else {
          alert("No payment record found for this auction.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert("Failed to verify payment. Please try again.");
      }
    }
  };

  // Release payment to seller (Admin only)
  const releasePaymentToSeller = async (auctionId, auctionTitle) => {
    if (window.confirm(`Are you sure you want to release payment to the seller for "${auctionTitle}"?`)) {
      try {
        const token = sessionStorage.getItem("adminToken");
        await axios.post(
          `http://localhost:5000/api/admin/auction/${auctionId}/release-payment`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Refresh the auctions list to update the status
        const res = await axios.get("http://localhost:5000/api/admin/auctions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(res.data);
        
        alert("Payment released to seller successfully!");
      } catch (error) {
        console.error("Error releasing payment:", error);
        alert("Failed to release payment. Please try again.");
      }
    }
  };

  // Image modal handlers
  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Search input handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Filter auctions by title matching search term
  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = filteredAuctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const totalAuctions = auctions.length;
  const pendingAuctions = auctions.filter(a => a.status === 'pending').length;
  const activeAuctions = auctions.filter(a => a.status === 'active').length;
  const approvedAuctions = auctions.filter(a => a.status === 'approved').length;
  const draftAuctions = auctions.filter(a => a.status === 'draft').length;
  // Get auctions with pending payments (status is 'pending' and has payment_id)
  const pendingPayments = auctions.filter(a => a.status === 'pending' && a.payment_id).length;
  const escrowAuctions = auctions.filter(a => a.escrow_status && a.escrow_status !== 'completed').length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <SideAdmin />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow p-6 ml-48">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Auctions</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Stats Cards - Updated to 6 columns */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Auctions</p>
                <p className="text-2xl font-bold text-gray-900">{totalAuctions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{draftAuctions}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAuctions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeAuctions}</p>
              </div>
            </div>
          </div>

          {/* NEW: Payment Stats Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
              </div>
            </div>
          </div>

          {/* Escrow Stats Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Escrow Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{escrowAuctions}</p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Auctions
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by title..."
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Auctions Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Auctions Management ({filteredAuctions.length} auctions found)
              </h2>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Actions</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAuctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{auction.title}</div>
                        <div className="text-xs text-gray-400">ID: {auction.id}</div>
                        {auction.final_price && (
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            Final: ₱{auction.final_price}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Seller Info Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {auction.author_pfp ? (
                            <img 
                              src={`http://localhost:5000/uploads/${auction.author_pfp}`} 
                              alt="Seller" 
                              className="w-8 h-8 rounded-full border-2 border-blue-300"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">S</span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-gray-900">@{auction.author_username}</div>
                            <div className="text-xs text-gray-600">{auction.author_fullname}</div>
                          </div>
                        </div>
                        {auction.author_gcash && (
                          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            <span className="font-medium">GCash:</span> {auction.author_gcash}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-green-600">₱{auction.current_price}</div>
                    </td>
                    
                    {/* Winner Info Column */}
                    <td className="px-6 py-4">
                      {auction.winner_username ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {auction.winner_pfp ? (
                              <img 
                                src={`http://localhost:5000/uploads/${auction.winner_pfp}`} 
                                alt="Winner" 
                                className="w-8 h-8 rounded-full border-2 border-purple-300"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                                <span className="text-xs font-bold text-purple-600">W</span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-purple-600">@{auction.winner_username}</div>
                              <div className="text-xs text-gray-600">{auction.winner_fullname}</div>
                            </div>
                          </div>
                          {auction.winner_gcash && (
                            <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <span className="font-medium">GCash:</span> {auction.winner_gcash}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No winner yet</div>
                      )}
                    </td>
                    
                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          auction.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : auction.status === "approved"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : auction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : auction.status === "rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : auction.status === "stopped"
                            ? "bg-gray-300 text-gray-700 border border-gray-400"
                            : auction.status === "ended"
                            ? "bg-gray-400 text-gray-800 border border-gray-500"
                            : auction.status === "draft"
                            ? "bg-gray-100 text-gray-600 border border-gray-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {auction.status}
                      </span>
                    </td>
                    
                    {/* Payment Status Column - Now checks payment record */}
                    <td className="px-6 py-4">
                      {auction.payment_id ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          auction.payment_status === 'pending' 
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : auction.payment_status === 'completed'
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : auction.payment_status === 'failed'
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {auction.payment_status || 'pending'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {auction.status === 'draft' ? 'Awaiting payment' : 'No payment'}
                        </span>
                      )}
                    </td>
                    
                    {/* Payment Actions Column */}
                    <td className="px-6 py-4">
                      {auction.payment_id && auction.status === 'pending' && auction.payment_status === 'pending' && (
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => verifyPayment(auction.id, 'completed', auction.title)}
                            className="inline-flex items-center px-3 py-1 bg-transparent text-green-600 border border-green-600 rounded-lg font-semibold text-xs hover:bg-green-600 hover:text-white transition-colors"
                          >
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Verify
                          </button>
                          <button
                            onClick={() => verifyPayment(auction.id, 'failed', auction.title)}
                            className="inline-flex items-center px-3 py-1 bg-transparent text-red-600 border border-red-600 rounded-lg font-semibold text-xs hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {auction.payment_status === 'completed' && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                      )}
                      {auction.payment_status === 'failed' && (
                        <span className="text-xs text-red-600 font-medium">✗ Rejected</span>
                      )}
                      {auction.status === 'draft' && !auction.payment_id && (
                        <span className="text-xs text-gray-500">Waiting for user payment</span>
                      )}
                    </td>
                    
                    {/* Escrow Column */}
                    <td className="px-6 py-4">
                      {auction.escrow_status ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            auction.escrow_status === 'pending_payment'
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : auction.escrow_status === 'paid'
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : auction.escrow_status === 'item_received'
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : auction.escrow_status === 'completed'
                              ? "bg-gray-100 text-gray-600 border border-gray-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {auction.escrow_status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(auction.end_time)}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {/* Status Management Buttons */}
                        <div className="flex space-x-2">
                          {auction.status === "draft" && (
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Awaiting payment
                            </div>
                          )}

                          {auction.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveAuction(auction.id, auction.title)}
                                className="inline-flex items-center px-3 py-1.5 bg-transparent text-green-600 border border-green-600 rounded-lg font-semibold text-xs hover:bg-green-600 hover:text-white transition-colors"
                              >
                                <CheckIcon className="w-3 h-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => rejectAuction(auction.id, auction.title)}
                                className="inline-flex items-center px-3 py-1.5 bg-transparent text-red-600 border border-red-600 rounded-lg font-semibold text-xs hover:bg-red-600 hover:text-white transition-colors"
                              >
                                <XMarkIcon className="w-3 h-3 mr-1" />
                                Reject
                              </button>
                            </>
                          )}

                          {auction.status === "approved" && (
                            <>
                              <button
                                onClick={() => activateAuction(auction.id, auction.title)}
                                className="inline-flex items-center px-3 py-1.5 bg-transparent text-green-600 border border-green-600 rounded-lg font-semibold text-xs hover:bg-green-600 hover:text-white transition-colors"
                              >
                                <PlayIcon className="w-3 h-3 mr-1" />
                                Activate
                              </button>
                              <button
                                onClick={() => stopAuction(auction.id, auction.title)}
                                className="inline-flex items-center px-3 py-1.5 bg-transparent text-red-600 border border-red-600 rounded-lg font-semibold text-xs hover:bg-red-600 hover:text-white transition-colors"
                              >
                                <StopIcon className="w-3 h-3 mr-1" />
                                Stop
                              </button>
                            </>
                          )}

                          {auction.status === "active" && (
                            <button
                              onClick={() => stopAuction(auction.id, auction.title)}
                              className="inline-flex items-center px-3 py-1.5 bg-transparent text-red-600 border border-red-600 rounded-lg font-semibold text-xs hover:bg-red-600 hover:text-white transition-colors"
                            >
                              <StopIcon className="w-3 h-3 mr-1" />
                              Stop
                            </button>
                          )}
                        </div>

                        {/* Escrow Management Buttons */}
                        {auction.escrow_status === 'item_received' && (
                          <div className="mt-2">
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mb-1">
                              <span className="font-medium">Send to:</span> {auction.author_gcash || 'No GCash'}
                            </div>
                            <button
                              onClick={() => releasePaymentToSeller(auction.id, auction.title)}
                              className="inline-flex items-center w-full justify-center px-3 py-1.5 bg-transparent text-purple-600 border border-purple-600 rounded-lg font-semibold text-xs hover:bg-purple-600 hover:text-white transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              Release Payment
                            </button>
                          </div>
                        )}

                        {auction.escrow_status === 'paid' && auction.winner_gcash && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            <span className="font-medium">Contact buyer:</span> {auction.winner_gcash}
                          </div>
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
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstAuction + 1} to {Math.min(indexOfLastAuction, filteredAuctions.length)} of {filteredAuctions.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
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
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
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

          {filteredAuctions.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No auctions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search term" : "No auctions in the database"}
              </p>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 relative">
              <button 
                onClick={closeImageModal} 
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
              <img 
                src={selectedImage} 
                alt="Auction" 
                className="w-full h-auto max-h-[80vh] object-contain rounded-md" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayAuctions;