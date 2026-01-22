import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckIcon, 
  TrashIcon, 
  BellIcon,
  HeartIcon, 
  UserPlusIcon,
  ChatBubbleLeftIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  ShoppingBagIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Sidebar from "../sidebar/sidebar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Helper function to get icon based on notification type
  const getNotificationIcon = (type, isRead) => {
    const customPurple = '#970FFA';
    
    switch(type) {
      case 'post_like':
      case 'artwork_like':
        return (
          <div className="p-1.5 rounded-full bg-white border-2 border-purple-100 shadow-sm">
            <HeartIconSolid className="h-4 w-4" style={{ color: customPurple }} />
          </div>
        );
      case 'follow':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-green-500'}`}>
            <UserPlusIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'comment':
      case 'artwork_comment':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-blue-500'}`}>
            <ChatBubbleLeftIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'auction_bid':
      case 'auction_win':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-purple-500'}`}>
            <ScaleIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'artwork_post':
      case 'post':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-yellow-500'}`}>
            <PhotoIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'commission':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-orange-500'}`}>
            <ShoppingBagIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'verification':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-teal-500'}`}>
            <DocumentCheckIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      case 'report':
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-red-500'}`}>
            <ExclamationTriangleIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
      default:
        return (
          <div className={`p-1.5 rounded-full ${isRead ? 'bg-gray-200' : 'bg-blue-500'}`}>
            <BellIcon className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-white'}`} />
          </div>
        );
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'post_like':
      case 'artwork_like':
        return 'bg-purple-50 border-purple-100'; // Changed to purple
      case 'follow':
        return 'bg-green-50 border-green-100';
      case 'comment':
      case 'artwork_comment':
        return 'bg-blue-50 border-blue-100';
      case 'auction_bid':
      case 'auction_win':
        return 'bg-purple-50 border-purple-100';
      case 'artwork_post':
      case 'post':
        return 'bg-yellow-50 border-yellow-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${userId}/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 text-gray-800 ml-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg relative">
              <BellIcon className="h-7 w-7 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                {notifications.length} total • {unreadCount} unread
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <CheckIcon className="h-4 w-4" />
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-2">
              You'll see notifications here when you get likes, comments, or follows.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {currentNotifications.map((notif, index) => (
                  <li
                    key={notif.id}
                    className={`px-5 py-4 transition-all duration-150 cursor-pointer group ${
                      index === 4 ? '' : 'border-b-0'
                    } ${!notif.is_read ? getNotificationColor(notif.type) : ''} 
                    hover:bg-gray-50 border-b border-gray-100 last:border-b-0`}
                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Profile picture */}
                        <div className="relative flex-shrink-0">
                          {notif.sender_pfp ? (
                            <div className="relative">
                              <img 
                                src={`http://localhost:5000/uploads/${notif.sender_pfp}`} 
                                alt={notif.sender_username || 'User'}
                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${notif.sender_username || 'User'}&background=random&color=fff&size=128`;
                                }}
                              />
                              {/* Icon overlay */}
                              <div className="absolute -bottom-1 -right-1">
                                {getNotificationIcon(notif.type, notif.is_read)}
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-white shadow-sm">
                                <span className="text-white font-bold text-lg">
                                  {notif.sender_username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="absolute -bottom-1 -right-1">
                                {getNotificationIcon(notif.type, notif.is_read)}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Status indicator and username */}
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.is_read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            <p className="font-semibold text-gray-900 truncate">
                              {notif.sender_username || 'User'}
                            </p>
                          </div>
                          
                          <p className={`text-gray-700 ${notif.is_read ? '' : 'font-medium'}`}>
                            {notif.message}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-xs text-gray-500">
                              {formatDate(notif.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        {!notif.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            title="Mark as read"
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-full transition opacity-0 group-hover:opacity-100"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          title="Delete notification"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition opacity-0 group-hover:opacity-100"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                
                {/* Fill empty slots */}
                {currentNotifications.length < 5 && (
                  Array.from({ length: 5 - currentNotifications.length }).map((_, index) => (
                    <li key={`empty-${index}`} className="px-5 py-4 h-[76px] border-b border-gray-100 last:border-b-0">
                      <div className="h-full flex items-center">
                        <div className="text-gray-300 italic">
                          No more notifications on this page
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                        if (index === 4) pageNum = totalPages;
                      } else if (currentPage >= totalPages - 2) {
                        if (index === 0) pageNum = 1;
                        else pageNum = totalPages - 4 + index;
                      } else {
                        if (index === 0) pageNum = 1;
                        else if (index === 4) pageNum = totalPages;
                        else pageNum = currentPage - 2 + index;
                      }
                      
                      return pageNum <= totalPages ? (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ) : null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;