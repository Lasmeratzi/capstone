import React, { useState } from "react";
import axios from "axios";

export default function MakeAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files.length ? Array.from(e.target.files) : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !endTime || !startingPrice || files.length === 0) {
      setError("All fields and at least one image are required.");
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Create the auction post
      const auctionResponse = await axios.post("http://localhost:5000/api/auctions", {
        title,
        description,
        end_time: endTime,
        starting_price: startingPrice,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const auctionId = auctionResponse.data.auctionId;

      // Step 2: Upload auction media images
      const formData = new FormData();
      formData.append("auction_id", auctionId);
      files.forEach((file) => formData.append("media", file));

      await axios.post("http://localhost:5000/api/auction-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Auction created and images uploaded successfully!");
      setTitle("");
      setDescription("");
      setEndTime("");
      setStartingPrice("");
      setFiles([]);

    } catch (error) {
      console.error("Error creating auction:", error);
      setError(error.response?.data?.message || "Failed to create auction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₱)</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (multiple)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
        >
          {submitting ? "Submitting..." : "Create Auction"}
        </button>
      </form>
    </div>
  );
}
