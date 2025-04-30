import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"

  const handleLogin = (e) => {
    e.preventDefault();
    // Navigate to the Admin Home page
    navigate("/homeadmin");
  };

  const handleRememberMeToggle = () => {
    setRememberMe(!rememberMe); // Toggle the Remember Me state
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Image with Copyright Below */}
      <div
        className="w-1/2 flex flex-col justify-between bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/images/lgin.jpeg')" }}
      >
        {/* Empty Spacer */}
        <div></div>

        {/* Copyright Text */}
        <div className="text-center text-black text-sm font-medium p-4">
          © 2025 Illura. All rights reserved.
        </div>
      </div>

      {/* Right Section: Admin Login Form */}
      <div
        className="w-1/2 flex items-center justify-center relative"
        style={{ backgroundColor: "#EAE7E6" }}
      >
        <div className="w-[500px] p-8 bg-white shadow-md rounded-lg">
          {/* Welcome Admin Section */}
          <div className="text-center mb-6">
            <p className="text-2xl text-gray-600">Welcome Admin</p>
            <h1 className="text-4xl text-gray-800 custom-font">Illura Admin</h1>
          </div>

          {/* Login Form */}
          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            {/* Admin Username Input */}
            <div>
              <label htmlFor="admin_user" className="block text-sm font-medium text-gray-700">
                Admin Username
              </label>
              <input
                type="text"
                id="admin_user"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Admin Password Input */}
            <div>
              <label htmlFor="admin_pass" className="block text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <input
                type="password"
                id="admin_pass"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-lg hover:opacity-80 focus:ring focus:ring-blue-300"
              style={{ backgroundColor: "#00040d" }}
            >
              Log In
            </button>
          </form>

          {/* Back to User Login Link */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Go back to{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;