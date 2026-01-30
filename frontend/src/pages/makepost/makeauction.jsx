import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCardIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function MakeAuction({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [auctionStartTime, setAuctionStartTime] = useState("");
  const [auctionDurationHours, setAuctionDurationHours] = useState("24");
  const [customDuration, setCustomDuration] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [useIncrement, setUseIncrement] = useState(false);
  const [bidIncrement, setBidIncrement] = useState("100.00");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  
  // Payment flow states
  const [step, setStep] = useState(1);
  const [auctionId, setAuctionId] = useState(null);
  const [illuraGCash, setIlluraGCash] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const API_BASE = "http://localhost:5000";

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [filePreviews]);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  // 🔴 CRITICAL FIX: Load portfolio data FIRST when component mounts
  useEffect(() => {
    console.log("🔍 MakeAuction component mounted");
    console.log("📂 Checking localStorage for portfolio data...");
    
    // Method 1: Check for current portfolio key
    const portfolioKey = localStorage.getItem('currentPortfolioKey');
    console.log("🗝️ Found portfolio key:", portfolioKey);
    
    if (portfolioKey) {
      try {
        const savedData = localStorage.getItem(portfolioKey);
        if (savedData) {
          console.log("📦 Loading portfolio data from localStorage...");
          const data = JSON.parse(savedData);
          console.log("✅ Portfolio data loaded:", data);
          
          setPortfolioData(data);
          
          // Pre-fill form fields immediately
          if (data.title) {
            console.log("📝 Setting title:", data.title);
            setTitle(data.title);
          }
          
          if (data.description) {
            console.log("📝 Setting description:", data.description);
            setDescription(data.description);
          }
          
          // Clean up localStorage
          localStorage.removeItem(portfolioKey);
          localStorage.removeItem('currentPortfolioKey');
          console.log("🧹 Cleaned up localStorage");
        }
      } catch (error) {
        console.error("❌ Error loading portfolio data:", error);
      }
    }
    
    // Method 2: Check for old key format (backward compatibility)
    const oldKeyData = localStorage.getItem('portfolioToAuction');
    if (oldKeyData) {
      try {
        console.log("🔄 Found old format portfolio data");
        const data = JSON.parse(oldKeyData);
        if (data.portfolioItem) {
          setPortfolioData(data.portfolioItem);
          setTitle(data.portfolioItem.title || '');
          setDescription(data.portfolioItem.description || '');
        }
        localStorage.removeItem('portfolioToAuction');
      } catch (error) {
        console.error("Error parsing old portfolio data:", error);
      }
    }
  }, []);

  // Load portfolio image when portfolio data exists
  useEffect(() => {
    if (portfolioData && portfolioData.image_path && files.length === 0) {
      console.log("🖼️ Attempting to load portfolio image:", portfolioData.image_path);
      loadPortfolioImage(portfolioData.image_path);
    }
  }, [portfolioData]);

  // Fetch Illura GCash info when payment step is reached
  useEffect(() => {
    if (step === 2) {
      fetchIlluraGCash();
    }
  }, [step]);

  

  const fetchIlluraGCash = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/illura-gcash`);
      setIlluraGCash(response.data);
    } catch (error) {
      console.error("Failed to fetch Illura GCash info:", error);
      setError("Failed to load payment information. Please try again.");
    }
  };

  // 🔴 FIXED: Load portfolio image with better error handling
  const loadPortfolioImage = async (imagePath) => {
    console.log("📸 loadPortfolioImage called with:", imagePath);
    
    try {
      if (!imagePath) {
        console.error("No image path provided");
        setError("Note: Portfolio image path is missing. Please upload an image manually.");
        return;
      }

      // Construct the correct image URL
      let imageUrl;
      if (imagePath.startsWith('http')) {
        imageUrl = imagePath;
      } else if (imagePath.startsWith('/')) {
        imageUrl = `${API_BASE}${imagePath}`;
      } else {
        // Remove any leading slashes or uploads/ duplicates
        const cleanPath = imagePath.replace(/^\/+/, '').replace(/^uploads\//, '');
        imageUrl = `${API_BASE}/uploads/${cleanPath}`;
      }

      console.log("🌐 Fetching image from:", imageUrl);

      // Fetch the image
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("Image blob is empty");
      }

      // Create a File object
      const fileName = imagePath.split('/').pop() || 'portfolio-image.jpg';
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

      console.log("✅ File created:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Add to files array
      setFiles(prev => {
        // Check if file already exists
        const exists = prev.some(f => f.name === file.name && f.size === file.size);
        if (exists) {
          console.log("⚠️ File already exists in array");
          return prev;
        }
        return [...prev, file];
      });

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews(prev => {
        // Check if preview already exists
        const exists = prev.some(p => p.file.name === file.name);
        if (exists) {
          console.log("⚠️ Preview already exists");
          URL.revokeObjectURL(previewUrl);
          return prev;
        }
        return [...prev, { file, preview: previewUrl }];
      });

      console.log("🎉 Portfolio image loaded successfully");

    } catch (error) {
      console.error("❌ Failed to load portfolio image:", error);
      console.error("Full error:", error);
      setError(`Note: Could not load portfolio image (${error.message}). Please upload it manually.`);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length) {
      setFiles([...files, ...newFiles]);
      
      const newPreviews = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFilePreviews([...filePreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...filePreviews];
    
    URL.revokeObjectURL(newPreviews[index].preview);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  // STEP 1: Create auction
  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title || !description || !auctionStartTime || !startingPrice || files.length === 0) {
      setError("All fields and at least one image are required.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    // Validate bid increment if enabled
    if (useIncrement) {
      if (!bidIncrement || parseFloat(bidIncrement) <= 0) {
        setError("Bid increment must be greater than 0.");
        return;
      }
      if (parseFloat(bidIncrement) > parseFloat(startingPrice) * 0.5) {
        setError("Bid increment cannot be more than 50% of starting price.");
        return;
      }
    }

    // Validate custom duration if selected
    if (auctionDurationHours === "") {
      if (!customDuration || parseFloat(customDuration) <= 0) {
        setError("Please enter a valid custom duration (minimum 0.0833 hours/5 minutes).");
        return;
      }
      if (parseFloat(customDuration) > 720) {
        setError("Maximum duration is 720 hours (30 days).");
        return;
      }
    }

    try {
      setSubmitting(true);

      // Calculate final duration
      const finalDuration = auctionDurationHours === "" 
        ? parseFloat(customDuration) 
        : parseFloat(auctionDurationHours);

      const auctionResponse = await axios.post(
        `${API_BASE}/api/auctions`,
        {
          title,
          description,
          auction_start_time: auctionStartTime,
          auction_duration_hours: finalDuration,
          starting_price: startingPrice,
          use_increment: useIncrement ? 1 : 0,
          bid_increment: bidIncrement,
          portfolio_item_id: portfolioData?.id || null
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const newAuctionId = auctionResponse.data.auctionId;
      setAuctionId(newAuctionId);

      // Upload media
      const formData = new FormData();
      formData.append("auction_id", newAuctionId);
      files.forEach((file) => formData.append("media", file));

      await axios.post(`${API_BASE}/api/auction-media`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Move to payment step
      setStep(2);

        } catch (error) {
      console.error("❌ Error creating auction:", error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Connection refused')) {
        setError("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        setError(error.response?.data?.message || "Failed to create auction.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 2: Confirm payment
  const handleConfirmPayment = async () => {
    if (!auctionId) {
      setError("Auction ID is missing. Please try again.");
      return;
    }

    try {
      setPaymentSubmitting(true);
      setError("");

      const response = await axios.post(
        `${API_BASE}/api/payments/confirm-auction-payment`,
        {
          auctionId: auctionId,
          paymentMethod: paymentMethod,
          referenceNumber: referenceNumber || `AUCTION-${auctionId}-${Date.now()}`
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("✅ Payment confirmed:", response.data);
      setStep(3);

    } catch (error) {
      console.error("Error confirming payment:", error);
      setError(error.response?.data?.message || "Failed to confirm payment.");
      setPaymentSubmitting(false);
    }
  };

  // Reset form for new auction
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAuctionStartTime("");
    setAuctionDurationHours("24");
    setCustomDuration("");
    setStartingPrice("");
    setUseIncrement(false);
    setBidIncrement("100.00");
    setFiles([]);
    setFilePreviews([]);
    setTermsAccepted(false);
    setStep(1);
    setAuctionId(null);
    setReferenceNumber("");
    setPortfolioData(null);
  };

  // STEP 3: Success view
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Confirmed!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your ₱100 payment for auction creation has been recorded.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-start">
                  <CheckIcon className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Auction created and payment confirmed</span>
                </li>
                <li className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-yellow-400 mt-0.5 mr-2 flex-shrink-0"></div>
                  <span>Waiting for admin approval (1-2 business days)</span>
                </li>
                <li className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-gray-300 mt-0.5 mr-2 flex-shrink-0"></div>
                  <span>Auction will go live on scheduled start time</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setStep(1);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Another Auction
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Payment information
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header - Fixed */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">Pay Auction Creation Fee</h1>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                disabled={paymentSubmitting}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Portfolio Data Indicator */}
            {portfolioData && (
              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-5 w-5 text-orange-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Created from portfolio: "{portfolioData.title}"
                    </p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      Your portfolio item has been converted to an auction
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Pay ₱100 Auction Creation Fee</h3>
                  <p className="text-sm text-gray-500">Required to submit your auction for approval</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Important:</span> Your auction "<span className="font-semibold">{title}</span>" 
                  will remain pending until payment is confirmed and approved by admin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Payment Information */}
              <div className="space-y-6">
                {/* Illura GCash Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Send Payment to Illura GCash
                  </h4>
                  
                  {illuraGCash ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">GCash Number</p>
                          <p className="text-lg font-bold text-blue-900">{illuraGCash.gcash_number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Account Name</p>
                          <p className="text-lg font-bold text-blue-900">{illuraGCash.gcash_name}</p>
                        </div>
                      </div>
                      
                      {illuraGCash.qr_code_path && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-2">QR Code</p>
                          <div className="flex justify-center">
                            <img 
                              src={`${API_BASE}/uploads/${illuraGCash.qr_code_path}`}
                              alt="GCash QR Code"
                              className="w-48 h-48 border border-gray-300 rounded-lg object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Amount */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Auction Creation Fee</span>
                    <span className="text-lg font-bold text-green-600">₱100.00</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    This one-time fee covers auction listing and admin review
                  </p>
                </div>
              </div>

              {/* Right side - Payment Confirmation Form */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Confirm Your Payment</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="gcash">GCash</option>
                        <option value="manual">Manual/Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reference Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="e.g., GCash transaction ID"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include if you have a transaction reference number
                      </p>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-2 text-sm">Payment Instructions:</h5>
                      <ol className="text-xs text-green-700 space-y-1.5">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">1.</span>
                          <span>Send ₱100 to the Illura GCash account shown</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">2.</span>
                          <span>Take a screenshot of your payment confirmation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">3.</span>
                          <span>Fill out the payment details on this form</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">4.</span>
                          <span>Click "I Have Paid ₱100" to complete the process</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={paymentSubmitting}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex-1"
                  >
                    Back to Auction Details
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={paymentSubmitting}
                    className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      paymentSubmitting 
                        ? "bg-green-400 cursor-not-allowed" 
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {paymentSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Confirming Payment...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        I Have Paid ₱100
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2 text-sm">Important Notes:</h5>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Your auction will only go live after admin approval (1-2 business days)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Keep your payment receipt/screenshot for reference</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>If payment is not confirmed within 24 hours, the auction will be cancelled</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>For payment issues, contact support@illura.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: Create auction form
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-y-auto" style={{ maxHeight: '95vh' }}>
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {portfolioData ? `Create Auction from "${portfolioData.title}"` : "Create New Auction"}
              </h1>
              <p className="text-xs text-gray-500">Step 1 of 2: Auction Details</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500"
              disabled={submitting}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Portfolio Data Indicator */}
            {portfolioData && (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-5 w-5 text-green-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Pre-filled from your portfolio: "{portfolioData.title}"
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      You can modify any fields below. Portfolio image has been loaded.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateAuction} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side - Text fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Vintage Camera Collection"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={5}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your item in detail..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={auctionStartTime}
                        onChange={(e) => setAuctionStartTime(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        When your auction should start (after admin approval)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <select
                          value={auctionDurationHours}
                          onChange={(e) => setAuctionDurationHours(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Custom</option>
                          <option value="0.0833">5 minutes</option>
                          <option value="0.1667">10 minutes</option>
                          <option value="0.25">15 minutes</option>
                          <option value="0.5">30 minutes</option>
                          <option value="1">1 hour</option>
                          <option value="3">3 hours</option>
                          <option value="6">6 hours</option>
                          <option value="12">12 hours</option>
                          <option value="24">24 hours</option>
                          <option value="48">48 hours</option>
                          <option value="72">72 hours</option>
                          <option value="168">7 days</option>
                        </select>
                        
                        {auctionDurationHours === "" && (
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0.0833"
                                max="720"
                                step="0.0833"
                                value={customDuration || ""}
                                onChange={(e) => setCustomDuration(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 0.25 for 15 minutes"
                              />
                              <span className="text-sm text-gray-600 whitespace-nowrap">hours</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Min: 0.0833h (5min) • Max: 720h (30 days)
                            </p>
                          </div>
                        )}
                        
                        {auctionDurationHours !== "" && (
                          <p className="text-xs text-gray-500">
                            Selected: {auctionDurationHours} hours
                            {parseFloat(auctionDurationHours) < 1 && 
                              ` (${Math.round(parseFloat(auctionDurationHours) * 60)} minutes)`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Starting Price (₱) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₱</span>
                      <input
                        type="number"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Bid Increment Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Enable Bid Increments
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseIncrement(!useIncrement)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          useIncrement ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            useIncrement ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {useIncrement && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bid Increment Amount (₱) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">₱</span>
                          <input
                            type="number"
                            value={bidIncrement}
                            onChange={(e) => setBidIncrement(e.target.value)}
                            min="0.01"
                            step="0.01"
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="100.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Bids must increase by this exact amount (e.g., ₱100, ₱500)
                        </p>
                      </div>
                    )}

                    {!useIncrement && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Note:</span> With bid increments OFF, users can bid any amount above current price.
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">Auction Creation Fee</h4>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-blue-700">
                        One-time fee to list your auction
                      </p>
                      <span className="text-lg font-bold text-blue-900">₱100.00</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Payable after filling this form. Required for admin review.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms and Conditions <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          I agree to pay ₱100 auction creation fee and understand the terms
                        </label>
                        <p className="text-gray-500">By checking this box, you confirm you understand our auction policies and fees.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Image upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Images <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Portfolio Image Preview (if exists) */}
                    {portfolioData && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-medium text-amber-800 mb-2">
                          Portfolio Image Loaded:
                        </p>
                        <div className="relative aspect-square w-full max-w-xs mx-auto mb-2">
                          <img
                            src={`${API_BASE}/uploads/${portfolioData.image_path}`}
                            alt="Portfolio preview"
                            className="w-full h-full object-cover rounded-lg border-2 border-amber-300"
                          />
                          <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                            From Portfolio
                          </div>
                        </div>
                        <p className="text-xs text-amber-700">
                          This image has been automatically added from your portfolio.
                          You can add more images below if needed.
                        </p>
                      </div>
                    )}
                    
                    {/* Image previews */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {portfolioData && index === 0 && (
                            <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                              Portfolio
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* File upload area */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 10MB each)</p>
                          {portfolioData && (
                            <p className="text-xs text-amber-600 mt-1">
                              Portfolio image already loaded. Add more if needed.
                            </p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Auction Tips */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Auction Tips</h3>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1.5">•</span>
                        <span>Set a competitive starting price to attract bidders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1.5">•</span>
                        <span>Include multiple high-quality photos from different angles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1.5">•</span>
                        <span>Be detailed and honest in your item description</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1.5">•</span>
                        <span>Consider setting the start time for when most buyers are active</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1.5">•</span>
                        <span>Use bid increments to control bidding pace (₱100, ₱500 increments)</span>
                      </li>
                      {portfolioData && (
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-1.5">•</span>
                          <span className="text-amber-700">Your portfolio description has been pre-filled. Review and update it for the auction.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    submitting 
                      ? "bg-blue-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}