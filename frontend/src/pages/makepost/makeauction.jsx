import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MakeAuction({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [filePreviews]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !endTime || !startingPrice || files.length === 0) {
      setError("All fields and at least one image are required.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      setSubmitting(true);

      const auctionResponse = await axios.post(
        "http://localhost:5000/api/auctions",
        {
          title,
          description,
          end_time: endTime,
          starting_price: startingPrice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const auctionId = auctionResponse.data.auctionId;
      const formData = new FormData();
      formData.append("auction_id", auctionId);
      files.forEach((file) => formData.append("media", file));

      await axios.post("http://localhost:5000/api/auction-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(true);

    } catch (error) {
      console.error("Error creating auction:", error);
      setError(error.response?.data?.message || "Failed to create auction.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Auction Created Successfully!</h3>
            <p className="text-sm text-gray-500 mb-6">Your auction is now live and visible to potential buyers.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setTitle("");
                  setDescription("");
                  setEndTime("");
                  setStartingPrice("");
                  setFiles([]);
                  setFilePreviews([]);
                  setTermsAccepted(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Create New Auction</h1>
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
          <div className="flex-1 overflow-auto px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-6">
                {/* Left side - Text fields */}
                <div className="flex-1 space-y-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms and Conditions <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
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
                          I agree to the auction terms and conditions
                        </label>
                        <p className="text-gray-500">By checking this box, you confirm you understand our auction policies.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Image upload */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Image previews */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
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

                  {/* Auction Tips */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                        <span>Consider setting the end time for when most buyers are active</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Close
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
                  ) : "Create Auction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}