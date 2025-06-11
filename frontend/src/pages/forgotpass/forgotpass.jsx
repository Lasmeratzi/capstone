import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const ForgotPass = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle the email submission for resetting the password
    alert("Password reset link has been sent to your email!");
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('src/assets/images/paper.jpg')", // Set the background image
      }}
    >
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        {/* Forgot Password Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the email address associated with your account. We'll send you a link to reset your password.
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-80 focus:ring focus:ring-blue-300"
            style={{ backgroundColor: "#00040d" }}
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Go Back to {" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPass;