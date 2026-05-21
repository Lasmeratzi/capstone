import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEye, faEyeSlash, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminRole", data.role);
      navigate("/homeadmin");

    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FA] overflow-hidden p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        {/* Fixed Branding Header */}
        <div className="text-center mb-8">
          <img src="/illura.png" alt="Illura Logo" className="w-14 h-14 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Illura Internal Management</p>
        </div>

        {/* Structured Professional Form */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Username</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-all text-sm text-gray-900"
                  placeholder="admin_id"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-[#1A1A1A] text-white text-sm font-bold rounded-lg hover:bg-black transition-all cursor-pointer mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Verifying..." : "Sign In to Admin"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
              Return to Website
            </Link>
          </div>
        </div>

        {/* Non-scrolling Footer */}
        <p className="mt-8 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          © 2026 ILLURA MANAGEMENT SYSTEM
        </p>
      </motion.div>
    </div>
  );
};

export default LoginAdmin;