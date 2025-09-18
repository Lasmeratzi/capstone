import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import Sidebar from "../sidebar/sidebar"; // adjust path if needed

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notifications/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentNotifications = notifications.slice(
    startIndex,
    startIndex + pageSize
  );

  // Format date (only date, no time)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 text-gray-800 ml-64">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications for now.</p>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Fixed-height list */}
            <ul className="space-y-3 h-[480px]">
              {currentNotifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex justify-between items-start p-3 rounded-lg border shadow-sm transition ${
                    notif.is_read
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <div className="flex-1">
                    <p
                      className={`${
                        notif.is_read
                          ? "text-gray-700"
                          : "text-gray-900 font-medium"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notif.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        title="Mark as read"
                        className="text-gray-500 hover:text-green-600 transition"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete notification"
                      className="text-gray-500 hover:text-red-600 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2 border-t pt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
