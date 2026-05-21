import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faEye, faEyeSlash, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import GlareHover from "../../components/glarehover/glarehover"; // Ensure the path is correct

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          navigate("/home");
        } else {
          console.error("Token expired. Clearing token.");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token format. Clearing token.");
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { token, id, fullname, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("username", username);

        setTimeout(() => {
          navigate("/home");
        }, 500);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-white dark:bg-[#0A0A0B] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Standalone Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#111112]/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-xl cursor-pointer hover:scale-110 hover:text-[#5E66FF] transition-all text-gray-600 dark:text-gray-400"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl" />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Hero Image (Adaptable Style) */}
        <div
          className="hidden lg:flex lg:w-[45%] flex-col justify-between relative bg-cover bg-center overflow-hidden border-r border-gray-100 dark:border-white/5"
          style={{ backgroundImage: "url('/images/mechak6.webp')" }}
        >
          {/* Overlay Gradients for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
          
          {/* Top Brand Badge */}
          <div className="relative p-8 z-10 flex items-center space-x-4">
            <img src="/illura.png" alt="Illura Logo" className="w-10 h-10 drop-shadow-lg" />
            <h1 className="text-3xl font-bold text-white custom-font tracking-tight">Illura</h1>
          </div>

          {/* Bottom Artist Credit */}
          <div className="relative p-8 z-10">
             <div className="absolute bottom-6 left-6 text-[10px] md:text-xs text-gray-400 font-medium tracking-wide bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 select-none transition-all duration-300">
               Art by <span className="text-white ml-1 font-normal">Ralf Martinez</span>
             </div>
          </div>
        </div>

        {/* Right Section - Login Content (Clean & Centered) */}
        <div className="w-full lg:w-[55%] flex items-center justify-center relative bg-white dark:bg-[#0A0A0B] transition-colors duration-300">
          <div className="w-full max-w-[420px] p-8 md:p-0 transition-all">
            {/* Mobile-only Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <img src="/illura.png" alt="Illura Logo" className="w-10 h-10" />
              <h1 className="text-3xl text-gray-900 dark:text-gray-400 custom-font">Illura</h1>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Log In</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back! Please enter your details.</p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:border-transparent focus:outline-none dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:border-transparent focus:outline-none dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {errorMessage && <p className="text-sm text-red-500 font-medium text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{errorMessage}</p>}
              {isLoading && <p className="text-sm text-gray-500 text-center animate-pulse">Verifying credentials...</p>}

              {/* GlareHover wrapper with button inside */}
              <GlareHover
                width="100%"
                height="auto"
                background="#00040d"
                borderRadius="8px"
                glareColor="#ffffff"
                glareOpacity={0.7}
                glareSize={200}
                transitionDuration={650}
                playOnce={true}
                style={{ display: 'block' }}
              >
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white rounded-lg focus:ring focus:ring-blue-300 cursor-pointer"
                  style={{
                    backgroundColor: "transparent",
                    border: 'none',
                    pointerEvents: isLoading ? 'none' : 'auto',
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </GlareHover>
            </form>

            <p className="text-sm text-center text-gray-500 dark:text-gray-500 mt-8">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#5E66FF] font-semibold hover:underline">
                Create one for free
              </Link>
            </p>
          </div>

          <Link to="/loginadmin" className="absolute bottom-6 right-6 text-gray-400 dark:text-gray-600 hover:text-[#5E66FF] dark:hover:text-blue-400 transition-colors text-xs font-medium uppercase tracking-widest">
            Admin Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
