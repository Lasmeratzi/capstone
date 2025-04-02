import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  }); // Form data does NOT include `id` or `created_at`, as these are auto-managed
  const [termsAccepted, setTermsAccepted] = useState(false); // State for "Agree to Terms"
  const [showModal, setShowModal] = useState(false); // State for showing the modal

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    // Post form data to the server
    axios
      .post("http://localhost:5000/api/profiles", formData) // Adjust the endpoint as needed
      .then((response) => {
        alert("Sign-up successful!");
        navigate("/home"); // Navigate to the home page after successful sign-up
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        alert("Failed to sign up. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value }); // Update form data dynamically
  };

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle the modal visibility
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Image with Copyright Below */}
      <div
        className="w-1/2 flex flex-col justify-between bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/images/lgin.jpeg')" }}
      >
        <div></div>
        <div className="text-center text-black text-sm font-medium p-4">
          © 2025 Illura. All rights reserved.
        </div>
      </div>

      {/* Right Section: Sign-Up Form */}
      <div
        className="w-1/2 flex items-center justify-center"
        style={{ backgroundColor: "#EAE7E6" }}
      >
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          {/* Welcome to Illura Section */}
          <div className="text-center mb-6">
            <p className="text-2xl text-gray-600">Welcome to</p>
            <div className="flex items-center justify-center">
              <img
                src="src/assets/images/illura.png"
                alt="Illura Logo"
                className="w-18 h-18 mr-2"
              />
              <h1 className="text-5xl text-gray-800 custom-font">Illura</h1>
            </div>
          </div>

          {/* Sign-Up Form */}
          <form className="space-y-6 mt-6" onSubmit={handleSignUp}>
            {/* First Name Input */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name Input */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <span
                  onClick={toggleModal}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Terms and Conditions
                </span>
              </label>
            </div>

            {/* Sign-Up Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-80 focus:ring focus:ring-blue-300"
              style={{ backgroundColor: "#00040d" }}
            >
              Sign Up
            </button>
          </form>

          {/* Already Have an Account */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Modal for Terms and Conditions */}
      {showModal && (
        <div
          className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: "url('src/assets/images/paper.jpg')", // Background image for modal
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <p className="text-sm text-gray-600">
              By creating an account on Illura, you agree to the following:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc pl-5 space-y-2">
              {/* Terms and Conditions content */}
            </ul>
            <div className="text-right mt-4">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: "#00040d" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;