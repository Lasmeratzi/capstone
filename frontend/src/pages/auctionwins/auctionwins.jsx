import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import { 
  CheckIcon, 
  XMarkIcon, 
  CreditCardIcon, 
  CheckCircleIcon,
  CubeIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  EyeIcon,
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";

const AuctionWins = () => {
  const [auctionWins, setAuctionWins] = useState([]);
  const [sellerAuctions, setSellerAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState("won");
  const [loading, setLoading] = useState(true);
  const [illuraGCash, setIlluraGCash] = useState(null);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptType, setReceiptType] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  
  const token = localStorage.getItem("token");

  // Fetch Illura GCash information
  const fetchIlluraGCash = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/illura-gcash");
      setIlluraGCash(response.data);
    } catch (error) {
      console.error("Failed to fetch Illura GCash info:", error);
    }
  };

  const fetchAuctionWins = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/won/auctions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuctionWins(response.data);
    } catch (error) {
      console.error("Failed to fetch auction wins:", error);
    }
  };

  const fetchSellerAuctions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auctions/sold`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerAuctions(response.data);
    } catch (error) {
      console.error("Failed to fetch seller auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (auctionId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/auction/${auctionId}/confirm-payment`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Payment confirmed! Please send the payment to Illura's GCash and wait for the seller to ship your item.");
      fetchAuctionWins();
      fetchSellerAuctions();
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  const confirmItemReceived = async (auctionId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/auction/${auctionId}/confirm-receipt`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Item receipt confirmed! The seller will receive payment soon.");
      fetchAuctionWins();
      fetchSellerAuctions();
    } catch (error) {
      console.error("Failed to confirm item receipt:", error);
      alert("Failed to confirm item receipt. Please try again.");
    }
  };

  const uploadPaymentReceipt = async (auctionId, file) => {
    if (!file) {
      alert("Please select a receipt file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setUploadingReceipt(true);
      await axios.post(
        `http://localhost:5000/api/auction/${auctionId}/upload-payment-receipt`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      alert("Payment receipt uploaded successfully! Please wait for Illura to verify.");
      fetchAuctionWins();
      fetchSellerAuctions();
    } catch (error) {
      console.error("Failed to upload receipt:", error);
      alert(error.response?.data?.message || "Failed to upload receipt. Please try again.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const viewReceipt = (receiptPath, type) => {
    setSelectedReceipt(`http://localhost:5000/uploads/${receiptPath}`);
    setReceiptType(type);
    setShowReceiptModal(true);
  };

  const getStatusBadge = (auction) => {
    const escrowStatus = auction.escrow_status;
    const statusConfig = {
      'pending_payment': { 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', 
        text: auction.payment_receipt_path ? 'Receipt Uploaded' : 'Awaiting Payment' 
      },
      'payment_rejected': { 
        color: 'bg-red-100 text-red-800 border border-red-200', 
        text: 'Payment Rejected' 
      },
      'paid': { 
        color: 'bg-blue-100 text-blue-800 border border-blue-200', 
        text: 'Payment Confirmed' 
      },
      'item_received': { 
        color: 'bg-green-100 text-green-800 border border-green-200', 
        text: 'Item Received' 
      },
      'completed': { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200', 
        text: 'Completed' 
      }
    };
    
    const config = statusConfig[escrowStatus] || { color: 'bg-gray-100 text-gray-800 border border-gray-200', text: 'Processing' };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>;
  };

  // Illura GCash Info Box Component
  const IlluraGCashInfoBox = () => (
    <div className="p-3 bg-blue-50 rounded border border-blue-200 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-blue-800 mb-1">Illura GCash Information</h4>
          <p className="text-xs text-blue-700">
            This is where payments should be sent. Always verify before sending.
          </p>
        </div>
        <button
          onClick={() => setShowGCashModal(true)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
      </div>
      {illuraGCash && (
        <div className="mt-2 text-xs text-gray-700 grid grid-cols-2 gap-1">
          <div>
            <span className="font-medium">Number:</span> {illuraGCash.gcash_number}
          </div>
          <div>
            <span className="font-medium">Name:</span> {illuraGCash.gcash_name}
          </div>
        </div>
      )}
    </div>
  );

  const GCashPaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md p-6 max-w-md w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Illura GCash Details</h3>
          <button
            onClick={() => setShowGCashModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {illuraGCash ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Always send payments to:</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <div className="text-center mb-3">
                <p className="font-medium text-gray-800">GCash Information</p>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">GCash Number:</span>
                  <p className="text-base font-semibold text-gray-900">{illuraGCash.gcash_number}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Account Name:</span>
                  <p className="text-base font-semibold text-gray-900">{illuraGCash.gcash_name}</p>
                </div>
              </div>

              {illuraGCash.qr_code_path && (
                <div className="mt-3 text-center">
                  <p className="font-medium text-gray-700 mb-1">QR Code:</p>
                  <img 
                    src={`http://localhost:5000/uploads/${illuraGCash.qr_code_path}`} 
                    alt="GCash QR Code"
                    className="w-40 h-40 mx-auto border border-gray-300 rounded object-contain"
                  />
                </div>
              )}
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Always double-check the GCash details before sending money
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-red-600">GCash information not available. Please contact support.</p>
          </div>
        )}
      </div>
    </div>
  );

  const ReceiptModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md p-6 max-w-4xl w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {receiptType === 'payment' ? 'Payment Receipt' : 'Release Receipt'}
          </h3>
          <button
            onClick={() => setShowReceiptModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {selectedReceipt ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <img 
                src={selectedReceipt} 
                alt="Receipt" 
                className="w-full h-auto max-h-[60vh] object-contain mx-auto rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x600?text=Receipt+Not+Found";
                }}
              />
            </div>
            
            <div className="text-sm text-gray-600 text-center">
              {receiptType === 'payment' 
                ? 'Buyer\'s GCash payment receipt to Illura'
                : 'Illura\'s payment receipt to Seller'}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-red-600">Receipt not found</p>
          </div>
        )}
      </div>
    </div>
  );

  const getBuyerActionButton = (auction) => {
    switch (auction.escrow_status) {
      case 'pending_payment':
        // If receipt already uploaded, show status
        if (auction.payment_receipt_path) {
          return (
            <div>
              <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-800">Receipt Uploaded</h3>
                  <button
                    onClick={() => viewReceipt(auction.payment_receipt_path, 'payment')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    View Receipt
                  </button>
                </div>
                <p className="text-xs text-green-700 mb-2">
                  {auction.payment_receipt_verified 
                    ? '✓ Verified by Illura' 
                    : '⏳ Waiting for Illura verification'}
                </p>
                <div className="text-xs text-gray-600">
                  Status: {auction.payment_receipt_verified ? 'Verified' : 'Pending Review'}
                </div>
              </div>
              
              {!auction.payment_receipt_verified && (
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload Different Receipt
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadPaymentReceipt(auction.id, e.target.files[0])}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
          );
        }
        
        // If no receipt uploaded, show upload form
        return (
          <div>
            <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-1">Upload Payment Receipt</h3>
              <p className="text-sm text-blue-700 mb-2">
                Send <span className="font-bold">₱{auction.final_price}</span> to Illura's GCash, then upload screenshot
              </p>
              <button
                onClick={() => setShowGCashModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium transition text-sm mb-2"
              >
                <CreditCardIcon className="w-4 h-4 inline mr-1" />
                View GCash Details
              </button>
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Upload GCash Receipt Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadPaymentReceipt(auction.id, e.target.files[0])}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploadingReceipt}
              />
              {uploadingReceipt && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              📸 Take a screenshot of your GCash payment confirmation
            </div>
          </div>
        );
        
      case 'payment_rejected':
        return (
          <div>
            <div className="mb-3 p-3 bg-red-50 rounded border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-red-600 font-medium">Receipt Rejected</p>
                {auction.payment_receipt_path && (
                  <button
                    onClick={() => viewReceipt(auction.payment_receipt_path, 'payment')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    View Receipt
                  </button>
                )}
              </div>
              <p className="text-xs text-red-600 mb-2">
                Please upload a valid receipt showing payment to Illura
              </p>
              <button
                onClick={() => setShowGCashModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium transition text-sm mb-2"
              >
                <CreditCardIcon className="w-4 h-4 inline mr-1" />
                View GCash Details Again
              </button>
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Upload New Receipt
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadPaymentReceipt(auction.id, e.target.files[0])}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploadingReceipt}
              />
            </div>
          </div>
        );
        
      case 'paid':
        return (
          <button
            onClick={() => confirmItemReceived(auction.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium transition text-sm"
          >
            <TruckIcon className="w-4 h-4 inline mr-1" />
            I Received the Item
          </button>
        );
        
      case 'item_received':
        return (
          <div className="text-gray-600 text-sm">
            <CheckCircleIcon className="w-4 h-4 inline mr-1 text-green-500" />
            Waiting for payment release to seller
          </div>
        );
        
      case 'completed':
        return (
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
              Transaction Completed
            </div>
            <button
              onClick={() => setShowGCashModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View Illura GCash Details
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getSellerActionSection = (auction) => {
    switch (auction.escrow_status) {
      case 'pending_payment':
        return (
          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-1">Waiting for Buyer Payment</h4>
            <p className="text-sm text-yellow-700 mb-2">
              The buyer needs to pay <span className="font-bold">₱{auction.final_price}</span> to Illura
            </p>
            <button
              onClick={() => setShowGCashModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              View Illura GCash Details
            </button>
          </div>
        );
        
      case 'payment_rejected':
        return (
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <h4 className="font-medium text-red-800 mb-1">Payment Not Confirmed</h4>
            <p className="text-sm text-red-700">
              Buyer's payment was not confirmed by Illura. Waiting for them to try again.
            </p>
          </div>
        );
        
      case 'paid':
        return (
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-1">Payment Confirmed</h4>
            <p className="text-sm text-blue-700 mb-2">
              Payment received by Illura. Please ship the item to the buyer.
            </p>
            {auction.winner_gcash && (
              <div className="text-xs text-gray-600">
                <p className="font-medium">Buyer Contact:</p>
                <p>GCash: {auction.winner_gcash}</p>
              </div>
            )}
          </div>
        );
        
      case 'item_received':
        return (
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h4 className="font-medium text-green-800 mb-1">Item Delivered</h4>
            <p className="text-sm text-green-700">
              Buyer confirmed receipt. Waiting for Illura to release payment to your GCash.
            </p>
          </div>
        );
        
      case 'completed':
        return (
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">Transaction Completed</h4>
              {auction.release_receipt_path && (
                <button
                  onClick={() => viewReceipt(auction.release_receipt_path, 'release')}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  View Payment Receipt
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Payment of ₱{auction.final_price} has been released to your GCash account.
            </p>
            {auction.release_receipt_path ? (
              <div className="text-xs text-green-600 font-medium">
                ✓ Payment receipt available
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Waiting for Illura to upload payment receipt
              </div>
            )}
            <button
              onClick={() => setShowGCashModal(true)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              View Illura GCash Details
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Pagination logic
  const getCurrentItems = () => {
    const items = activeTab === "won" ? auctionWins : sellerAuctions;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = Math.ceil(
    (activeTab === "won" ? auctionWins.length : sellerAuctions.length) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchAuctionWins();
    fetchSellerAuctions();
    fetchIlluraGCash();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when tab changes
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 ml-64 overflow-y-auto">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Auction Transactions</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentItems = getCurrentItems();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>
      
      {/* Scrollable Main Content */}
      <div className="flex-1 p-6 ml-50 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Auction Transactions</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your auction purchases and sales</p>
          </div>

          {/* Always Visible Illura GCash Info */}
          <IlluraGCashInfoBox />

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab("won")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "won"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Auction Wins ({auctionWins.length})
            </button>
            <button
              onClick={() => setActiveTab("sold")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "sold"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Your Sold Auctions ({sellerAuctions.length})
            </button>
          </div>

          {/* Auction Wins Tab */}
          {activeTab === "won" && (
            <>
              {auctionWins.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-50 rounded border border-gray-300 p-8 max-w-md mx-auto">
                    <CubeIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No auction wins yet</h3>
                    <p className="text-xs text-gray-600">Keep bidding on active auctions!</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {currentItems.map((auction) => (
                      <div
                        key={auction.id}
                        className="bg-white border border-gray-300 rounded p-4 hover:border-gray-400 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900">{auction.title}</h3>
                              <div className="ml-auto">
                                {getStatusBadge(auction)}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-3">{auction.description}</div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-700">
                              <div>
                                <span className="font-medium">Price:</span> 
                                <span className="ml-1 text-sm font-bold text-green-600">₱{auction.final_price}</span>
                              </div>
                              <div>
                                <span className="font-medium">Seller:</span> 
                                <span className="ml-1">{auction.seller_fullname || auction.seller_username}</span>
                              </div>
                              <div>
                                <span className="font-medium">Ended:</span> 
                                <span className="ml-1">{new Date(auction.end_time).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                              {auction.escrow_status === 'pending_payment' && (
                                <div>
                                  <p className="text-sm text-gray-700 mb-1">💡 Send payment to Illura's GCash to complete your purchase</p>
                                  {auction.payment_receipt_path && (
                                    <div className="flex items-center text-xs text-green-600">
                                      <PhotoIcon className="w-3 h-3 mr-1" />
                                      Receipt uploaded: {auction.payment_receipt_verified ? '✓ Verified' : '⏳ Pending verification'}
                                    </div>
                                  )}
                                </div>
                              )}
                              {auction.escrow_status === 'payment_rejected' && (
                                <p className="text-sm text-red-600">❌ Payment not confirmed. Please check and try again.</p>
                              )}
                              {auction.escrow_status === 'paid' && (
                                <p className="text-sm text-gray-700">📦 Wait for seller to ship your item</p>
                              )}
                              {auction.escrow_status === 'item_received' && (
                                <p className="text-sm text-gray-700">⏳ Payment will be released to the seller shortly</p>
                              )}
                            </div>
                            
                            <div>
                              {getBuyerActionButton(auction)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded border ${
                            currentPage === 1
                              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded text-sm ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded border ${
                            currentPage === totalPages
                              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Your Sold Auctions Tab */}
          {activeTab === "sold" && (
            <>
              {sellerAuctions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-50 rounded border border-gray-300 p-8 max-w-md mx-auto">
                    <CreditCardIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No sold auctions yet</h3>
                    <p className="text-xs text-gray-600">Your completed auctions will appear here</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {currentItems.map((auction) => (
                      <div
                        key={auction.id}
                        className="bg-white border border-gray-300 rounded p-4 hover:border-gray-400 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900">{auction.title}</h3>
                              <div className="ml-auto">
                                {getStatusBadge(auction)}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-3">{auction.description}</div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-700">
                              <div>
                                <span className="font-medium">Sold For:</span> 
                                <span className="ml-1 text-sm font-bold text-green-600">₱{auction.final_price}</span>
                              </div>
                              <div>
                                <span className="font-medium">Winner:</span> 
                                <span className="ml-1">
                                  {auction.winner_fullname || auction.winner_username || `User #${auction.winner_id}`}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Ended:</span> 
                                <span className="ml-1">{new Date(auction.end_time).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                              {getSellerActionSection(auction)}
                            </div>
                            
                            <div className="flex flex-col justify-center">
                              {auction.escrow_status === 'completed' && auction.release_receipt_path && (
                                <div className="text-center">
                                  <div className="mb-1">
                                    <DocumentArrowUpIcon className="w-5 h-5 text-green-500 mx-auto" />
                                  </div>
                                  <span className="text-xs text-green-600 font-medium">Payment Receipt Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded border ${
                            currentPage === 1
                              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded text-sm ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded border ${
                            currentPage === totalPages
                              ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Modals */}
          {showGCashModal && <GCashPaymentModal />}
          {showReceiptModal && <ReceiptModal />}
        </div>
      </div>
    </div>
  );
};

export default AuctionWins;