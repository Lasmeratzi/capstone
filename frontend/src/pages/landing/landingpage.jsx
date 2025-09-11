import React from "react";
import Navbar from "../navbar/navbar"; // Ensure the path matches your project structure

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Desktop / Tablet View */}
      <div className="hidden md:flex flex-grow items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Landing page works! (Desktop / Tablet)
        </h1>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-grow flex-col items-center justify-center bg-blue-50 px-6 text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Mobile Landing Page
        </h1>
        <p className="text-gray-600">
          Welcome to the mobile experience! This layout is tailored for smaller
          screens.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
