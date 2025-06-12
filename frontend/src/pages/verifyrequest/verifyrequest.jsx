import React, { useState } from "react";
import axios from "axios";
import { FaXTwitter, FaInstagram, FaFacebook, FaCheck, FaSpinner } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Request Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Our team will review your verification request within 24-48 hours.
          You'll receive a notification once processed.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium w-full"
        >
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-center mb-4">
          <FaShieldAlt className="text-3xl mr-3" />
          <h1 className="text-2xl font-bold">Account Verification</h1>
        </div>
        <p className="text-blue-100 text-center">
          Verify your identity to establish trust and credibility
        </p>
      </div>

      <div className="p-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FaShieldAlt className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Why Verify?</h3>
            <p className="text-sm text-gray-600">
              Verification helps establish your online presence and legitimacy. 
              Our team monitors verified accounts to ensure quality content. 
              Regular posting is required to maintain verified status.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaXTwitter className="text-gray-400" />
            </div>
            <input
              type="url"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition"
              placeholder="https://facebook.com/yourhandle"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing Request...
                </>
              ) : (
                <>
                  <FaShieldAlt className="mr-2" />
                  Submit Verification Request
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By verifying, you agree to our content guidelines and community standards.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyRequest;