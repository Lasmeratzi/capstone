import React from "react";
import Navbar from "../navbar/navbar"; // Ensure the path matches your project structure

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800">Landing page works!</h1>
      </div>
    </div>
  );
};

export default LandingPage;