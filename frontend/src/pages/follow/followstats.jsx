import React, { useEffect, useState } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

const FollowStats = ({ targetUserId }) => {
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [modal, setModal] = useState({ 
    show: false, 
    type: null, 
    users: [], 
    title: "" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/follow/stats/${targetUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats({
          followers: response.data.followers,
          following: response.data.following
        });
      } catch (error) {
        console.error("Failed to fetch follow stats:", error);
      }
    };
    fetchFollowStats();
  }, [targetUserId]);

  const fetchList = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = type === "followers" 
        ? `followers/${targetUserId}` 
        : `following/${targetUserId}`;
      
      const response = await axios.get(
        `http://localhost:5000/api/follow/${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModal({
        show: true,
        type,
        users: response.data,
        title: type === "followers" ? "Followers" : "Following"
      });
    } catch (error) {
      console.error(`Failed to fetch ${type} list:`, error);
    }
    setLoading(false);
  };

  const closeModal = () => setModal({ ...modal, show: false });

  const UserListItem = ({ user }) => (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <img
        src={user.pfp 
          ? `http://localhost:5000/uploads/${user.pfp}` 
          : "/default-pfp.png"}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      <div className="ml-3">
        <p className="font-medium text-gray-900">{user.username}</p>
        {user.fullname && (
          <p className="text-sm text-gray-500">{user.fullname}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={() => fetchList("followers")}
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="font-semibold">{stats.followers}</span>
        <span>Followers</span>
      </button>
      
      <button
        onClick={() => fetchList("following")}
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="font-semibold">{stats.following}</span>
        <span>Following</span>
      </button>

      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{modal.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : modal.users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No {modal.type} found
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {modal.users.map((user) => (
                    <UserListItem key={user.id} user={user} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowStats;