import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar"; // adjust path if needed
import { TrashIcon } from "@heroicons/react/24/outline";

const AuctionWins = () => {
  const [auctionWins, setAuctionWins] = useState([]);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const fetchAuctionWins = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auctionwins/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuctionWins(response.data);
    } catch (error) {
      console.error("Failed to fetch auction wins:", error);
    }
  };

  const deleteWin = async (winId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auctionwins/${winId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAuctionWins();
    } catch (error) {
      console.error("Failed to delete auction win:", error);
    }
  };

  useEffect(() => {
    fetchAuctionWins();
  }, []);

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Auction Wins</h1>

        {auctionWins.length === 0 ? (
          <p className="text-gray-500">You haven't won any auctions yet.</p>
        ) : (
          <ul className="w-full max-w-2xl space-y-4">
            {auctionWins.map((win) => (
              <li
                key={win.id}
                className="flex justify-between items-center p-4 rounded-xl shadow-md bg-blue-50 border-l-4 border-blue-500"
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-800">{win.auction_title}</h2>
                  <p className="text-sm text-gray-600">
                    Winning Bid: <span className="font-semibold">${win.winning_bid}</span>
                  </p>
                  <p className="text-sm text-gray-500">Ended: {new Date(win.ended_at).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => deleteWin(win.id)}
                  title="Remove from list"
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AuctionWins;
