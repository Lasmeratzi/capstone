import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import Sidebar from "../sidebar/sidebar"; // adjust the path based on your structure

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications for now.</p>
        ) : (
          <ul className="w-full max-w-2xl space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-md ${
                  notif.is_read ? "bg-gray-100" : "bg-blue-50 border-l-4 border-blue-500"
                }`}
              >
                <span className={notif.is_read ? "text-gray-600" : "text-gray-800 font-medium"}>
                  {notif.message}
                </span>

                <div className="flex items-center space-x-4">
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
        )}
      </div>
    </div>
  );
};

export default Notifications;