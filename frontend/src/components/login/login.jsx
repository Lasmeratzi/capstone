import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"

  const handleLogin = (e) => {
    e.preventDefault();
    // Add logic for login and handling "Remember Me" if necessary
    navigate("/home"); // Navigate to the Home page
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
        {/* Empty Spacer to push copyright notice down */}
        <div></div>

        {/* Copyright Text */}
        <div className="text-center text-black text-sm font-medium p-4">
          © 2025 Illura. All rights reserved.
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div
        className="w-1/2 flex items-center justify-center"
        style={{ backgroundColor: "#EAE7E6" }} // Updated background color
      >
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
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

          {/* Login Form */}
          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password and Remember Me Row */}
            <div className="flex justify-between items-center mt-2">
              {/* Forgot Password */}
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline text-sm"
              >
                Forgot Password?
              </a>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeToggle}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
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
          
          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;