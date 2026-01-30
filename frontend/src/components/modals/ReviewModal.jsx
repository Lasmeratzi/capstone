import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, userReview, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userReview) {
            setRating(userReview.rating);
            setReviewText(userReview.review_text || '');
        }
    }, [userReview]);

    const handleSubmit = async () => {
        console.log("🎯 handleSubmit called in ReviewModal");
        console.log("⭐ Rating:", rating);
        console.log("📝 Review text:", reviewText);
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            console.log("🔑 Token from localStorage:", token ? "Exists" : "Missing");
            
            // Decode the token to see what's in it
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log("📋 Token payload:", payload);
                } catch (e) {
                    console.log("❌ Could not decode token:", e.message);
                }
            }
            
            console.log("📤 Making POST request to /api/reviews/submit");
            console.log("📦 Request payload:", { rating, reviewText });
            
            const response = await axios.post(
                'http://localhost:5000/api/reviews/submit',
                { rating, reviewText },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            console.log("✅ Response received:", response.data);
            
            if (response.data.success) {
                alert(response.data.message);
                onReviewSubmitted();
                onClose();
            } else {
                alert('Review submission failed: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error("❌ Error submitting review:");
            console.error("- Error message:", error.message);
            console.error("- Error response data:", error.response?.data);
            console.error("- Error status:", error.response?.status);
            console.error("- Full error:", error);
            
            if (error.response?.data?.message) {
                alert(`Failed to submit review: ${error.response.data.message}`);
            } else if (error.response?.data?.error) {
                alert(`Failed to submit review: ${error.response.data.error}`);
            } else {
                alert('Failed to submit review. Check console for details.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {userReview ? 'Edit Your Review' : 'Leave a Review'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 transition p-2 hover:bg-gray-100 rounded-lg"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">
                            Help us improve Illura for Filipino artists
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        {/* Star Rating */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Rate Illura</h3>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`text-4xl transition-all duration-200 ${
                                            star <= (hoverRating || rating) 
                                                ? 'text-yellow-400 transform scale-110' 
                                                : 'text-gray-300'
                                        } hover:text-yellow-400 hover:scale-110`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>Poor</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Your Review (Optional)</h3>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Share your experience with Illura... What do you love? What can we improve?"
                                maxLength="500"
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                            />
                            <div className="text-right text-sm text-gray-500 mt-1">
                                {reviewText.length}/500 characters
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || rating === 0}
                                className={`px-5 py-2.5 font-medium rounded-lg transition ${
                                    rating === 0 || isSubmitting
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : userReview ? 'Update Review' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;