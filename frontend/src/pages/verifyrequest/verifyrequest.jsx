import React, { useState } from "react";
import axios from "axios";
import { FaXTwitter, FaInstagram, FaFacebook, FaCheck, FaSpinner } from "react-icons/fa6";

const VerifyRequest = ({ onSuccess, profile }) => {
  const [formData, setFormData] = useState({
    twitterLink: "",
    instagramLink: "",
    facebookLink: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit a request.");
      return;
    }

    if (profile?.verification_request_status === "pending" || profile?.isVerified) {
      alert(profile.isVerified 
        ? "Your account is already verified." 
        : "You already have a pending verification request.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/api/verifyrequest", {
        twitter_link: formData.twitterLink,
        instagram_link: formData.instagramLink,
        facebook_link: formData.facebookLink,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      setFormData({
        twitterLink: "",
        instagramLink: "",
        facebookLink: ""
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(error.response?.data?.message || "Failed to submit verification request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Request Submitted!</h2>
        <p className="text-gray-600 mb-6">Your verification request has been received. We'll review it shortly.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Verify Your Account</h1>
        <p className="text-gray-600 mt-2">Provide your social media links for verification</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaXTwitter className="text-gray-400" />
            </div>
            <input
              type="url"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://x.com/yourhandle"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaInstagram className="text-gray-400" />
            </div>
            <input
              type="url"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://instagram.com/yourhandle"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFacebook className="text-gray-400" />
            </div>
            <input
              type="url"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://facebook.com/yourhandle"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default VerifyRequest;