import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import AuctionBids from "../comments/auctionbids"; // Adjust path as needed

const API_BASE = "http://localhost:5000";

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/auctions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const auctionsWithMedia = await Promise.all(
          res.data.map(async (auction) => {
            const mediaRes = await axios.get(
              `${API_BASE}/api/auction-media/${auction.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...auction,
              media: mediaRes.data,
            };
          })
        );

        setAuctions(auctionsWithMedia);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setErrorMessage("Failed to load auctions.");
      }
    };

    fetchAuctions();
  }, []);

  const getGalleryLayoutClass = (mediaCount) => {
    if (mediaCount === 1) return "grid-cols-1";
    if (mediaCount === 2) return "grid-cols-2";
    if (mediaCount === 3) return "grid-cols-2";
    if (mediaCount === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-4">
      <h2 className="text-2xl font-bold mb-4">Live Auctions</h2>
      {errorMessage && (
        <p className="text-center text-red-500 mb-4">{errorMessage}</p>
      )}
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-3">
              {auction.author_pfp ? (
                <img
                  src={`${API_BASE}/uploads/${auction.author_pfp}`}
                  alt={`${auction.author}'s profile`}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">N/A</span>
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800">{auction.author_username}</p>
                <p className="text-gray-600 text-sm">{auction.author_fullname}</p>
              </div>
            </div>

            {/* Auction Title & Description */}
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {auction.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{auction.description}</p>

            {/* Price Info */}
            <div className="flex gap-4 mb-2 text-sm">
              <p className="text-gray-800 font-medium">
                Starting Price: <span className="text-blue-600">₱{auction.starting_price}</span>
              </p>
              <p className="text-gray-800 font-medium">
                Current Price: <span className="text-green-600">₱{auction.current_price}</span>
              </p>
            </div>

            {/* Auction Status */}
            <p
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                auction.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } mb-2`}
            >
              Status: {auction.status}
            </p>

            {/* End Time */}
            <p className="text-gray-500 text-xs mb-3">
              Ends: {new Date(auction.end_time).toLocaleString()}
            </p>

            {/* Media Gallery */}
            {auction.media && auction.media.length > 0 && (
              <div
                className={`grid ${getGalleryLayoutClass(
                  auction.media.length
                )} gap-2 rounded-lg overflow-hidden`}
              >
                {auction.media.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <img
                      src={`${API_BASE}/uploads/${item.media_path}`}
                      alt="Auction media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Auction Bidding Form - Only show if active */}
            {auction.status === "active" && (
              <div className="mt-4">
                <AuctionBids 
                  auctionId={auction.id} 
                  currentPrice={parseFloat(auction.current_price)} 
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No auctions available.</p>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X size={32} />
            </button>
            <img
              src={`${API_BASE}/uploads/${selectedMedia.media_path}`}
              alt="Auction media preview"
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Auctions;
