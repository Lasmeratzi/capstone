import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calculator, Info, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:5000";

// ✅ Format number with commas and 2 decimal places
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₱0.00";
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return "₱0.00";
  
  return `₱${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Smart formatting function that preserves cursor position
const formatInputValue = (value, cursorPos) => {
  if (!value) return { formatted: "", raw: "", newCursorPos: 0 };
  
  // Remove all non-digits except decimal point
  let cleaned = value.replace(/[^\d.]/g, '');
  
  // Only allow one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Store the raw value (for calculations)
  const rawValue = cleaned;
  
  // Split into whole and decimal parts
  const [whole, decimal] = cleaned.split('.');
  
  // Format whole number part with commas
  let formattedWhole = '';
  if (whole) {
    formattedWhole = parseInt(whole, 10).toLocaleString('en-US');
  }
  
  // Handle decimal part
  let formattedDecimal = '';
  if (decimal !== undefined) {
    // Limit to 2 decimal places
    formattedDecimal = '.' + decimal.slice(0, 2);
    // Pad with zeros if needed
    if (decimal.length < 2) {
      formattedDecimal += '0'.repeat(2 - decimal.length);
    }
  } else {
    formattedDecimal = '.00';
  }
  
  const formatted = formattedWhole + formattedDecimal;
  
  // Calculate new cursor position
  let newCursorPos = cursorPos;
  
  // If we're adding commas, adjust cursor position
  if (formattedWhole.includes(',')) {
    const commaCount = (formattedWhole.match(/,/g) || []).length;
    // Adjust cursor position based on how many commas were added
    if (cursorPos > whole.length) {
      newCursorPos = cursorPos + commaCount;
    }
  }
  
  return {
    formatted,
    raw: rawValue,
    newCursorPos: Math.min(newCursorPos, formatted.length)
  };
};

const AuctionBids = ({ auctionId, currentPrice, refreshAuctions }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [validationError, setValidationError] = useState(""); // ✅ Added for real-time validation
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [localCurrentPrice, setLocalCurrentPrice] = useState(currentPrice);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  const inputRef = useRef(null);

  // ✅ Setup auto-refresh when auction goes live
  useEffect(() => {
    if (!auctionId) return;

    // Initial fetch
    fetchAuctionDetails();
    fetchHighestBid();
    fetchBids();

    // Set up auto-refresh interval (every 5 seconds)
    const interval = setInterval(() => {
      fetchAuctionDetails();
      fetchHighestBid();
      fetchBids();
    }, 5000);

    setRefreshInterval(interval);

    // Cleanup on unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auctionId]);

  // ✅ Update local current price when prop changes
  useEffect(() => {
    setLocalCurrentPrice(currentPrice);
  }, [currentPrice]);

  // ✅ Fetch auction details including increment info
  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auctions/${auctionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch auction details");

      const data = await response.json();
      setAuctionDetails(data);
      
      if (data.current_price && data.current_price !== localCurrentPrice) {
        setLocalCurrentPrice(parseFloat(data.current_price));
      }
    } catch (err) {
      console.error("Error fetching auction details:", err);
    }
  };

  // ✅ Fetch highest bid
  const fetchHighestBid = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auctionbids/highest/${auctionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch highest bid");

      const data = await response.json();
      setHighestBid(data);
      
      if (data && data.bid_amount) {
        const newPrice = parseFloat(data.bid_amount);
        if (newPrice !== localCurrentPrice) {
          setLocalCurrentPrice(newPrice);
        }
      }
    } catch (err) {
      console.error("Error fetching highest bid:", err);
    }
  };

  // ✅ Fetch bid history
  const fetchBids = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auctionbids/${auctionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bids");

      const data = await response.json();
      setBids(data.sort((a, b) => b.bid_amount - a.bid_amount));
    } catch (err) {
      console.error("Error fetching bids:", err);
    }
  };

  // ✅ Calculate minimum bid based on increment rules
  const calculateMinimumBid = () => {
    if (!auctionDetails) return localCurrentPrice + 0.01;

    const useIncrement = auctionDetails.use_increment === 1;
    const bidIncrement = parseFloat(auctionDetails.bid_increment) || 100;

    if (!useIncrement) {
      return localCurrentPrice + 0.01;
    }

    if (localCurrentPrice === parseFloat(auctionDetails.starting_price)) {
      return localCurrentPrice + bidIncrement;
    }

    return localCurrentPrice + bidIncrement;
  };

  // ✅ Get placeholder text based on increment rules
  const getPlaceholderText = () => {
    if (!auctionDetails) return `Minimum bid: ${formatCurrency(localCurrentPrice + 0.01)}`;

    const useIncrement = auctionDetails.use_increment === 1;
    const bidIncrement = parseFloat(auctionDetails.bid_increment) || 100;
    const minBid = calculateMinimumBid();

    if (useIncrement) {
      return `Minimum: ${formatCurrency(minBid)} (increment: ${formatCurrency(bidIncrement)})`;
    }

    return `Minimum bid: ${formatCurrency(localCurrentPrice + 0.01)}`;
  };

  // ✅ Validate bid amount before submission - FIXED VERSION
  const validateBidAmount = (bidValue) => {
    if (!auctionDetails) {
      return { isValid: false, message: "Auction data not loaded" };
    }

    const useIncrement = auctionDetails.use_increment === 1;
    const bidIncrement = parseFloat(auctionDetails.bid_increment) || 100;
    const minBid = calculateMinimumBid();

    if (isNaN(bidValue)) {
      return { 
        isValid: false, 
        message: "Please enter a valid bid amount" 
      };
    }

    // ✅ CRITICAL FIX: Check if bid is lower or equal to current price FIRST
    if (bidValue <= localCurrentPrice) {
      return { 
        isValid: false, 
        message: `Bid must be GREATER than current price: ${formatCurrency(localCurrentPrice)}` 
      };
    }

    if (useIncrement) {
      if (bidValue < minBid) {
        return { 
          isValid: false, 
          message: `Minimum bid is ${formatCurrency(minBid)} (must increase by ${formatCurrency(bidIncrement)})` 
        };
      }

      const incrementCheck = (bidValue - localCurrentPrice) % bidIncrement;
      const isExactIncrement = Math.abs(incrementCheck) < 0.01;
      
      if (!isExactIncrement) {
        return { 
          isValid: false, 
          message: `Bid must increase by exactly ${formatCurrency(bidIncrement)} (e.g., ${formatCurrency(minBid)}, ${formatCurrency(minBid + bidIncrement)})` 
        };
      }
    }

    return { isValid: true, message: "" };
  };

  // ✅ Handle input change with smart formatting and real-time validation
  const handleInputChange = (e) => {
    const input = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    const { formatted, raw, newCursorPos } = formatInputValue(input, cursorPos);
    
    setDisplayAmount(formatted);
    setBidAmount(raw);
    setCursorPosition(newCursorPos);
    
    // ✅ REAL-TIME VALIDATION
    if (raw && raw !== "") {
      try {
        const bidValue = parseFloat(raw.replace(/,/g, ''));
        if (!isNaN(bidValue)) {
          const validation = validateBidAmount(bidValue);
          setValidationError(validation.isValid ? "" : validation.message);
        } else {
          setValidationError("");
        }
      } catch (err) {
        setValidationError("");
      }
    } else {
      setValidationError("");
    }
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // ✅ Handle bid submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bidValue = bidAmount ? parseFloat(bidAmount.replace(/,/g, '')) : 0;
    
    const validation = validateBidAmount(bidValue);
    if (!validation.isValid) {
      toast.error(validation.message, {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auctionbids/place-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ auction_id: auctionId, bid_amount: bidValue }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to place bid");

      toast.success("Bid placed successfully!", { 
        position: "top-right", 
        autoClose: 3000,
        icon: "✅"
      });

      setBidAmount("");
      setDisplayAmount("");
      setValidationError("");
      
      setLocalCurrentPrice(bidValue);
      await fetchAuctionDetails();
      await fetchHighestBid();
      await fetchBids();
      
      if (refreshAuctions) {
        await refreshAuctions();
      }
      
    } catch (err) {
      toast.error(err.message || "Error placing bid", {
        position: "top-right",
        autoClose: 3000,
        icon: "❌"
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Quick bid buttons based on increment
  const getQuickBidButtons = () => {
    if (!auctionDetails || !auctionDetails.use_increment) return [];

    const bidIncrement = parseFloat(auctionDetails.bid_increment) || 100;
    const minBid = calculateMinimumBid();
    
    return [
      { label: formatCurrency(minBid), value: minBid },
      { label: formatCurrency(minBid + bidIncrement), value: minBid + bidIncrement },
      { label: formatCurrency(minBid + (bidIncrement * 2)), value: minBid + (bidIncrement * 2) },
    ];
  };

  // ✅ Handle quick bid button click
  const handleQuickBidClick = (value) => {
    const rawValue = value.toString();
    const { formatted } = formatInputValue(rawValue, 0);
    setBidAmount(rawValue);
    setDisplayAmount(formatted);
    
    // Validate the quick bid
    const validation = validateBidAmount(value);
    setValidationError(validation.isValid ? "" : validation.message);
  };

  const quickBids = getQuickBidButtons();

  return (
    <div className="border-t pt-4 mt-4">
      {/* ✅ Bidding Rules Info */}
      {auctionDetails && (
        <div className={`mb-4 p-3 rounded-lg border ${
          auctionDetails.use_increment 
            ? 'bg-purple-50 border-purple-200' 
            : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {auctionDetails.use_increment ? (
              <>
                <Calculator className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Bid Increment Rules</span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Bidding Rules</span>
              </>
            )}
          </div>
          
          {auctionDetails.use_increment ? (
            <div className="space-y-1">
              <p className="text-xs text-purple-700">
                <span className="font-semibold">Increment:</span> {formatCurrency(parseFloat(auctionDetails.bid_increment))}
              </p>
              <p className="text-xs text-purple-700">
                <span className="font-semibold">Next bid:</span> {formatCurrency(calculateMinimumBid())}
              </p>
              <p className="text-xs text-purple-600">
                Bids must increase by exactly {formatCurrency(parseFloat(auctionDetails.bid_increment))}
              </p>
            </div>
          ) : (
            <p className="text-xs text-blue-700">
              Bid any amount above current price ({formatCurrency(localCurrentPrice)})
            </p>
          )}
        </div>
      )}

      {/* ✅ Highest Bidder Display */}
      {highestBid && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <h4 className="text-sm font-medium text-green-800 mb-1">Current Highest Bid</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{highestBid.bidder_username}</span>
              <span className="text-xs text-gray-500">{new Date(highestBid.created_at).toLocaleString()}</span>
            </div>
            <span className="text-lg font-bold text-green-600">{formatCurrency(highestBid.bid_amount)}</span>
          </div>
        </div>
      )}

      {/* ✅ Bid Form */}
      <h3 className="font-semibold text-gray-700 mb-2">Place Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Quick Bid Buttons (only for increment auctions) */}
        {auctionDetails?.use_increment && quickBids.length > 0 && (
          <div className="flex gap-2">
            {quickBids.map((quickBid, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickBidClick(quickBid.value)}
                className="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 border border-purple-200 transition-colors"
              >
                {quickBid.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              className="border rounded px-3 py-2 flex-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={getPlaceholderText()}
              value={displayAmount}
              onChange={handleInputChange}
              onSelect={(e) => {
                setCursorPosition(e.target.selectionStart || 0);
              }}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Bid"}
            </button>
          </div>
          
          {/* ✅ REAL-TIME VALIDATION ERROR DISPLAY */}
          {validationError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationError}
              </p>
            </div>
          )}
        </div>
      </form>

      {/* ✅ Important Note */}
      {auctionDetails?.use_increment && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-yellow-700 mb-1">
                <span className="font-semibold">Note:</span> Bids must increase by exactly {formatCurrency(parseFloat(auctionDetails.bid_increment))} increments
              </p>
              <p className="text-xs text-yellow-600">
                <span className="font-semibold">Current Price:</span> {formatCurrency(localCurrentPrice)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Bid History */}
      <div className="border-t pt-3 mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Bid History</h4>
        {bids.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No bids yet</p>
        ) : (
          <div className="space-y-2">
            {bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex justify-between items-center p-2 text-sm rounded ${
                  index === 0 ? "bg-green-50 border border-green-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{bid.bidder_username}</span>
                  <span className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleTimeString()}</span>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(bid.bid_amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionBids;