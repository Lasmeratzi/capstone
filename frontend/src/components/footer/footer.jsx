import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Copyright Section */}
        <div className="text-sm text-center md:text-left">
          © 2025 Illura. All rights reserved.
        </div>

        {/* Links Section */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="text-sm hover:text-blue-400 transition duration-200"
          >
            Contact Us
          </a>
          <a
            href="#"
            className="text-sm hover:text-blue-400 transition duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm hover:text-blue-400 transition duration-200"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;