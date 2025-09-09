import React from "react";
import SideAdmin from "../sideadmin/sideadmin";

const HomeAdmin = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideAdmin />

      {/* Main Content */}
      <div className="flex-grow p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">245</p>
          </div>

          {/* Active Auctions */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Active Auctions</h2>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Pending Verifications</h2>
            <p className="text-3xl font-bold text-yellow-500">5</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activities</h2>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <ul className="space-y-3">
              <li className="text-gray-600">✅ User <strong>@artlover23</strong> registered.</li>
              <li className="text-gray-600">⚠️ Verification request from <strong>@canvasQueen</strong> pending review.</li>
              <li className="text-gray-600">🏷️ New auction posted by <strong>@sketchmaster</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
