import React from "react";
import Navbar from "../navbar/navbar";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <Navbar />

      {/* Header with background image and overlay */}
      <div
        className="relative h-64 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/about.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 z-10"></div>

        {/* Header Content */}
     <div
  className="relative z-10 h-full flex items-center justify-center text-5xl font-bold space-x-4 bg-cover bg-center"
  style={{ backgroundImage: "url('/About.jpg')" }}
>
  <span>Welcome to</span>
  <img src="/illura.png" alt="Illura Logo" className="h-20 w-20" />
  <span className="text-5xl font-bold text-white custom-font">Illura</span>
</div>
</div>

      {/* Main Content */}
      <div className="flex-grow p-8 max-w-3xl mx-auto bg-white mt-12 rounded-3xl shadow-lg z-10 relative">
        {/* Description */}
        <p className="mb-6 font-medium">
          <strong>Illura</strong> is a digital platform that helps local artists showcase their work,
          connect with clients, and gain recognition. It provides tools for portfolio management,
          community engagement, and client connections, creating a supportive space for artists to grow.
        </p>

        {/* Key Features */}
        <h2 className="font-bold mb-2">Key Features</h2>
        <p className="mb-2"><strong>Portfolio Management:</strong> Easily create and showcase work.</p>
        <p className="mb-2"><strong>Community Engagement:</strong> Receive feedback through comments, likes, and upvotes.</p>
        <p className="mb-2"><strong>User Support:</strong> Chatbot assistance for new users.</p>
        <p className="mb-2"><strong>Search and Discovery:</strong> Find artists based on style, location, and availability.</p>
        <p className="mb-6"><strong>Reviews:</strong> Clients can leave feedback to build artist credibility.</p>

        {/* Target Users */}
        <h2 className="font-bold mb-2">Target Users</h2>
        <p className="mb-2"><strong>Artists:</strong> Showcase work and connect with clients.</p>
        <p className="mb-2"><strong>Aspiring Artists:</strong> Build portfolios and learn from others.</p>
        <p className="mb-2"><strong>Clients:</strong> Discover and hire talented artists.</p>
        <p className="mb-2"><strong>Art Enthusiasts:</strong> Explore local talent and engage with the community.</p>
        <p className="mb-6"><strong>Cultural Institutions:</strong> Promote and support local artists.</p>

        {/* Vision */}
        <h2 className="font-bold mb-2">Vision</h2>
        <p className="mb-2 font-medium">
          To empower local artists and build a thriving, connected creative community.
        </p>
      </div>
    </div>
  );
};

export default About;
