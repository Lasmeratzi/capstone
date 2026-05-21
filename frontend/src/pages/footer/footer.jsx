import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-[#0A0A0B] text-gray-600 dark:text-gray-300 mt-auto transition-colors duration-300">
      {/* Main Footer */}
      <div className="w-full px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div 
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 mb-4 cursor-pointer group w-fit"
            >
              <img
                src="/illura.png"
                alt="Illura Logo"
                className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-400 custom-font group-hover:text-[#5E66FF] transition-colors duration-200">
                Illura
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              A platform dedicated to empowering Filipino artists — showcase your
              work, connect with clients, and build your creative career.
            </p>
            {/* Social Links (placeholder icons) */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-[#5E66FF] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-[#5E66FF] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-[#5E66FF] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h2 className="text-gray-900 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Platform
            </h2>
            <ul className="space-y-2.5">
              {[
                { label: "About", path: "/about" },
                { label: "Sign Up", path: "/signup" },
                { label: "Log In", path: "/login" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h2 className="text-gray-900 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h2>
            <ul className="space-y-2.5">
              {[
                { label: "Terms of Service", path: "/terms" },
                { label: "Privacy Policy", path: "/terms" },
                { label: "Community Guidelines", path: "/terms" },
                { label: "Help Center", path: "/about" },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA Column */}
          <div>
            <h2 className="text-gray-900 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Join our growing community of artists and art enthusiasts today.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full px-5 py-2.5 bg-[#5E66FF] text-white rounded-lg font-medium text-sm hover:bg-[#4D5BFF] transition-all duration-200 shadow-lg shadow-indigo-900/30 cursor-pointer"
            >
              Create Free Account
            </button>
            <div className="mt-5">
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                support@illura.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-white/10">
        <div className="w-full px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {currentYear}{" "}
              <span className="custom-font">Illura</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/terms")}
                className="text-xs text-gray-500 hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
              >
                Terms
              </button>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <button
                onClick={() => navigate("/terms")}
                className="text-xs text-gray-500 hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
              >
                Privacy
              </button>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <button
                onClick={() => navigate("/about")}
                className="text-xs text-gray-500 hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
