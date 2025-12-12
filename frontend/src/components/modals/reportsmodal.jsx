import React, { useState } from "react";
import axios from "axios";
import { X, AlertTriangle, Loader } from "lucide-react";

const ReportsModal = ({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId,
  contentAuthorId 
}) => {
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reportCategories = [
    { value: 'spam', label: 'Spam' },
    { value: 'misleading', label: 'Misleading' },
    { value: 'fake_information', label: 'Fake Information' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'inappropriate', label: 'Inappropriate' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'hate_speech', label: 'Hate Speech' },
    { value: 'intellectual_property', label: 'Copyright Issue' },
    { value: 'self_harm', label: 'Self-Harm' },
    { value: 'scam_fraud', label: 'Scam/Fraud' },
    { value: 'violence', label: 'Violence' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportReason.trim()) {
      setError("Please provide a reason for reporting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/reports`,
        {
          content_type: contentType,
          content_id: contentId,
          report_category: reportCategory,
          reason: reportReason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(response.data.message || "Report submitted successfully!");
      resetAndClose();
    } catch (err) {
      console.error("Report submission failed:", err);
      setError(
        err.response?.data?.message || 
        "Failed to submit report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setReportReason("");
    setReportCategory("other");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Report {contentType}
                </h3>
                <p className="text-sm text-gray-500">
                  Help us keep the community safe
                </p>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's wrong with this content?
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {reportCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional details (required)
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please provide specific details about why you're reporting this content..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[120px]"
                rows="4"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reportReason.trim()}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition flex items-center gap-2 ${
                  isSubmitting || !reportReason.trim()
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs text-blue-600">i</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  Your report is anonymous. The content author won't know who reported them.
                  Our admin team will review your report within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;