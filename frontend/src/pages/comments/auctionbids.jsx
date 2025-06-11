import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000";

const AuctionBids = ({ auctionId, currentPrice, refreshAuctions }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch highest bid
  const fetchHighestBid = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auctionbids/highest/${auctionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch highest bid");

      const data = await response.json();
      console.log("🔹 Highest Bid Data:", data); // Debugging Step

      setHighestBid(data);
    } catch (err) {
      console.error("Error fetching highest bid:", err);
      toast.error("Could not load highest bid", {
        position: "top-right",
        autoClose: 3000,
      });
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
      toast.error("Could not load bids", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // ✅ Fetch highest bid & bid history on auction change
  useEffect(() => {
    if (!auctionId) {
      console.error("🔹 Auction ID is missing!");
      return;
    }

    fetchHighestBid();
    fetchBids();
  }, [auctionId]);

  // ✅ Handle bid submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= currentPrice) {
      toast.error(`Bid must be greater than current price: ₱${currentPrice}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      console.log("🔹 Sending bid request:", { auctionId, bidAmount: bidValue });

      const response = await fetch(`${API_BASE}/api/auctionbids/place-bid`, { // ✅ Corrected URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ auction_id: auctionId, bid_amount: bidValue }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to place bid");

      toast.success("Bid placed successfully!", { position: "top-right", autoClose: 3000 });

      setBidAmount("");
      await fetchHighestBid();
      await fetchBids();
      if (refreshAuctions) refreshAuctions();
    } catch (err) {
      toast.error(err.message || "Error placing bid", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      {/* ✅ Highest Bidder Display */}
      {highestBid && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Current Highest Bid</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{highestBid.bidder_username}</span>
              <span className="text-xs text-gray-500">{new Date(highestBid.created_at).toLocaleString()}</span>
            </div>
            <span className="text-lg font-bold text-green-600">₱{highestBid.bid_amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* ✅ Bid Form */}
      <h3 className="font-semibold text-gray-700 mb-2">Place Your Bid</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="number"
          step="0.01"
          min={currentPrice + 0.01}
          className="border rounded px-3 py-2 flex-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Minimum bid: ₱${(currentPrice + 0.01).toFixed(2)}`}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
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
      </form>

      {/* ✅ Bid History */}
      <div className="border-t pt-3">
        <h4 className="font-medium text-gray-700 mb-2">Bid History</h4>
        {bids.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No bids yet</p>
        ) : (
          <div className="space-y-2">
            {bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex justify-between items-center p-2 text-sm rounded ${
                  index === 0 ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{bid.bidder_username}</span>
                  <span className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleTimeString()}</span>
                </div>
                <span className="font-semibold text-gray-900">₱{bid.bid_amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionBids;