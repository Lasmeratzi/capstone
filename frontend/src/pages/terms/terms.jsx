import React from "react";
import Navbar from "../navbar/navbar";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      {/* Header with background image */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center text-white text-5xl font-bold"
        style={{ backgroundImage: "url('/your-header-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <h1 className="relative z-10">Terms & Services</h1>
      </div>

      {/* Main Content */}
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Terms Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">I. Terms</h2>
          <ul className="list-disc pl-6 space-y-3 text-sm leading-relaxed">
            <li><strong>Acceptance of Terms</strong><br />By using Illura, you agree to these terms. Stop using the platform if you disagree.</li>
            <li><strong>Eligibility</strong><br />Must be 13+. Parental consent required if under 18.</li>
            <li><strong>Account Responsibilities</strong>
              <ul className="list-disc pl-6">
                <li>Provide accurate information</li>
                <li>Secure your credentials</li>
                <li>You are responsible for account activity</li>
              </ul>
            </li>
            <li><strong>User Conduct</strong>
              <ul className="list-disc pl-6">
                <li>No harmful/illegal content</li>
                <li>Do not infringe on IP</li>
                <li>No abuse/harassment</li>
              </ul>
            </li>
            <li><strong>Intellectual Property</strong><br />Do not reproduce platform assets without permission.</li>
            <li><strong>Changes to Terms</strong><br />Continued use implies acceptance of updated terms.</li>
            <li><strong>Governing Law</strong><br />Governed by laws of [Insert Country]. Jurisdiction: [Insert Court].</li>
          </ul>
        </div>

        {/* Services Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">II. Services</h2>
          <ul className="list-disc pl-6 space-y-3 text-sm leading-relaxed">
            <li><strong>Portfolio Management:</strong> Artists can create profiles, upload art, and update portfolios.</li>
            <li><strong>Client Engagement:</strong> Users can browse, search, and leave feedback.</li>
            <li><strong>Interactive Features:</strong> Likes, comments, and profile sharing supported.</li>
            <li><strong>New User Support:</strong> Includes chatbot and tutorials for newcomers.</li>
            <li><strong>Platform Limitations:</strong> Initially supports limited region and stable internet. Full features coming soon.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Terms;
