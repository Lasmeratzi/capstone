import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion for animations

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  // Redirect logged-in users to /home (with token validation)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          navigate("/home"); // Redirect if token is valid
        } else {
          console.error("Token expired. Clearing token.");
          localStorage.removeItem("token"); // Clear expired token
        }
      } catch (error) {
        console.error("Invalid token format. Clearing token.");
        localStorage.removeItem("token"); // Clear invalid token
      }
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { token, id, fullname, username } = response.data;

        // Save token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("username", username);

        // Add a slight delay for the animation to finish before redirecting
        setTimeout(() => {
          navigate("/home");
        }, 500); // 500ms delay matches the animation duration
      }
    } catch (error) {
      setIsLoading(false); // Hide loading spinner
      console.error("Login error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid login credentials."); // Show error message
    } finally {
      setIsLoading(false); // Ensure spinner is hidden even if there's an error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // Start with opacity 0 and slightly above
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and default position
      exit={{ opacity: 0, y: 20 }} // Exit with a slight downward fade
      transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition timing
      className="flex h-screen"
    >
      {/* Left Section */}
      <div
        className="w-1/2 flex flex-col justify-between bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/images/lgin.jpeg')" }}
      >
        <div></div>
        <div className="text-center text-black text-sm font-medium p-4">© 2025 Illura. All rights reserved.</div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center relative" style={{ backgroundColor: "#EAE7E6" }}>
        <div className="w-[500px] py-25 px-18 bg-white shadow-md rounded-lg">
          <div className="text-center mb-6">
            <p className="text-2xl text-gray-600">Welcome to</p>
            <div className="flex items-center justify-center">
              <img src="src/assets/images/illura.png" alt="Illura Logo" className="w-18 h-18 mr-2" />
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && <p className="text-sm text-red-600 text-center">{errorMessage}</p>}

            {/* Loading State */}
            {isLoading && <p className="text-sm text-gray-600 text-center">Logging in...</p>}

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
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Admin Login Button */}
        <Link to="/loginadmin" className="absolute bottom-4 right-4 text-blue-600 hover:underline text-sm">
          Admin Login
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;