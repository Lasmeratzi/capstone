import React from "react";
import { useNavigate } from "react-router-dom";

const RSideHome = ({ user, accounts }) => {
  const navigate = useNavigate();

  return (
    <div className="w-95 py-6 pr-4">
      {/* Logged In User */}
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        {user.pfp ? (
          <img
            src={`http://localhost:5000/uploads/${user.pfp}`}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">N/A</span>
          </div>
        )}
        <div className="ml-3">
          <p className="font-bold text-gray-800">{user.username}</p>
          <p className="text-gray-600 text-sm">{user.fullname}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-3">Follow other artists</h3>
        <div className="space-y-3">
          {accounts.slice(0, 3).map((account) => (
            <div key={account.id} className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition">
              <img src={`http://localhost:5000/uploads/${account.pfp || "default.png"}`} alt={account.username} className="w-10 h-10 rounded-full border" />
              <div className="ml-3">
                <p className="font-medium text-gray-800">{account.username}</p>
                <p className="text-gray-500 text-sm">{account.fullname}</p>
              </div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-gray-500 text-sm">No other users available.</p>}
        </div>

        {/* Footer */}
        <div className="mt-10 text-xs text-gray-400 space-x-2">
          <span className="hover:underline cursor-pointer">About</span>·
          <span className="hover:underline cursor-pointer">Help</span>·
          <span className="hover:underline cursor-pointer">Privacy</span>·
          <span className="hover:underline cursor-pointer">Terms</span>·
          <p className="mt-3">&copy; 2025 Illura from Studio</p>
        </div>
      </div>
    </div>
  );
};

export default RSideHome;