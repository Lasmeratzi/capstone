import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const AuctionBids = ({ auctionId, currentPrice, refreshAuctions }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBids = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auctionbids/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch bids");
      const data = await response.json();
      setBids(data);
    } catch (err) {
      setError("Could not load bids");
    }
  };

  useEffect(() => {
    fetchBids();
  }, [auctionId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const bidValue = parseFloat(bidAmount);
  if (isNaN(bidValue) || bidValue <= currentPrice) {
    setError(`Bid must be greater than current price: ₱${currentPrice}`);
    return;
  }

  console.log("Auction ID:", auctionId);
  console.log("Token:", localStorage.getItem("token"));

  setLoading(true);
  try {
   const response = await fetch(`${API_BASE}/api/auction-bids`, { // ✅ Corrected route
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ auction_id: auctionId, bid_amount: bidValue }),
});

    const textResponse = await response.text(); // ✅ Read response as text first
    console.log("Raw Response:", textResponse); // ✅ Debug raw response

    let result;
    try {
      result = JSON.parse(textResponse); // ✅ Try parsing JSON
    } catch (err) {
      console.error("Response is not valid JSON:", textResponse);
      setError("Unexpected response from server.");
      return;
    }

    console.log("Response Status:", response.status, "Result:", result);

    if (!response.ok) {
      setError(result.message || "Failed to place bid");
    } else {
      setSuccess("Bid placed successfully!");
      setBidAmount("");
      fetchBids();
      if (refreshAuctions) refreshAuctions(); // Refresh auction data (current price)
    }
  } catch (err) {
    console.error("Error placing bid:", err);
    setError("Error placing bid");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="border-t pt-3">
      <h3 className="font-semibold text-gray-700 mb-2">Place Your Bid</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="number"
          step="0.01"
          className="border rounded px-2 py-1 flex-1"
          placeholder={`Enter > ₱${currentPrice}`}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Placing..." : "Bid"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <h4 className="font-medium text-gray-700 mb-1">Bid History</h4>
      {bids.length === 0 ? (
        <p className="text-sm text-gray-500">No bids yet.</p>
      ) : (
        <ul className="text-sm text-gray-800 space-y-1">
          {bids.map((bid) => (
            <li key={bid.id}>
              <span className="font-semibold">{bid.bidder_username}</span> bid ₱
              {bid.bid_amount.toFixed(2)} at{" "}
              {new Date(bid.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuctionBids;
