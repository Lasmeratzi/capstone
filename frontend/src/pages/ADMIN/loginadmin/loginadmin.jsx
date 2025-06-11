import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Sending Admin Login Request:", { username, password });

    try {
        const response = await fetch("http://localhost:5000/api/login/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Response Data:", data);

        if (!response.ok) {
            console.warn(`Login failed for admin: ${username}`);
            setError(data.message || "Invalid credentials");
            setLoading(false);
            return;
        }

        // ✅ Store admin credentials in `sessionStorage`
        sessionStorage.setItem("adminToken", data.token);
        sessionStorage.setItem("adminRole", data.role);

        console.log(`Admin ${username} logged in successfully. Role: ${data.role}`);

        navigate("/homeadmin");

    } catch (error) {
        console.error("Login failed:", error);
        setError("Server error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-between bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/images/lgin.jpeg')" }}>
        <div></div>
        <div className="text-center text-black text-sm font-medium p-4">
          © 2025 Illura. All rights reserved.
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center relative" style={{ backgroundColor: "#EAE7E6" }}>
        <div className="w-[500px] p-8 bg-white shadow-md rounded-lg">
          <div className="text-center mb-6">
            <p className="text-2xl text-gray-600">Welcome Admin</p>
            <h1 className="text-4xl text-gray-800 custom-font">Illura Admin</h1>
          </div>

          {/* Login Form */}
          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            {/* Display Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Admin Username Input */}
            <div>
              <label htmlFor="admin_user" className="block text-sm font-medium text-gray-700">
                Admin Username
              </label>
              <input
                type="text"
                id="admin_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
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