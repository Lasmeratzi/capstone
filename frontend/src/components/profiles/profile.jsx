import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import PortfolioGrid from "../profiles/portfoliogrid";
import PortfolioUpload from "../portfolioupload/portfolioupload";
import OwnPost from "../profiles/ownpost"; // Import OwnPost.jsx
import OwnArt from "../profiles/ownart"; // <-- Added OwnArt.jsx import
import OwnAuct from "../profiles/ownauct"; // <-- Added OwnAuct.jsx import
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { UserIcon, CakeIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { NewspaperIcon, PhotoIcon, Squares2X2Icon, TagIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [commissions, setCommissions] = useState("closed");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // Default: Posts

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        setCommissions(userResponse.data.commissions);

        const portfolioResponse = await axios.get("http://localhost:5000/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolioItems(portfolioResponse.data);
      } catch (error) {
        console.error("Failed to fetch profile or portfolio items:", error);
      }
    };

    fetchProfile();
  }, []);

  const toggleCommissions = async () => {
    const token = localStorage.getItem("token");
    const newStatus = commissions === "closed" ? "open" : "closed";

    try {
      await axios.patch(
        `http://localhost:5000/api/profile/commissions`,
        { commissions: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommissions(newStatus);
    } catch (error) {
      console.error("Failed to update commissions status:", error);
    }
  };

  const toggleUploadModal = () => setIsUploadModalOpen(!isUploadModalOpen);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-60 flex-grow px-40 py-4"
      >
        {/* Profile Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <div className="w-32 flex flex-col items-center">
              <img
                src={`http://localhost:5000/uploads/${user.pfp}`}
                alt={`${user.username}'s Profile`}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-gray-300"
              />

              {/* Commissions status */}
              <div className="mt-2 text-center text-xs text-gray-700 font-medium">
                <span className="mr-1">Commissions:</span>
                <button
                  onClick={toggleCommissions}
                  className={`px-3 py-1 rounded-full shadow transition duration-300 ${
                    commissions === "open"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {commissions === "open" ? "Open" : "Closed"}
                </button>
              </div>
            </div>

            <div className="ml-6 flex flex-col justify-between h-32">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.username}</h2>
                <div className="flex items-center text-sm sm:text-lg text-gray-600 mt-1">
                  <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                  {user.fullname}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                  <CakeIcon className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(user.birthdate).toLocaleDateString()}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 italic max-w-xs overflow-hidden text-ellipsis">
                {user.bio ? `"${user.bio}"` : "No bio provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={toggleUploadModal}
            className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-all duration-300 ease-in-out"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span className="text-sm">Portfolio</span>
          </button>
        </div>

        {/* Divider Line */}
        <div className="border-b border-gray-200 mb-4"></div>

        {/* Tabs: Posts, Portfolio, Own Art, Own Auction */}
  <div className="flex border-b border-gray-300 mb-6 text-sm">
  <button
    onClick={() => setActiveTab("posts")}
    className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
      activeTab === "posts"
        ? "border-b-4 border-blue-500 text-blue-600"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    <NewspaperIcon className="h-5 w-5" />
    Posts
  </button>

  <button
    onClick={() => setActiveTab("ownart")}
    className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
      activeTab === "ownart"
        ? "border-b-4 border-blue-500 text-blue-600"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    <PhotoIcon className="h-5 w-5" />
    Own Art
  </button>

  <button
    onClick={() => setActiveTab("portfolio")}
    className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
      activeTab === "portfolio"
        ? "border-b-4 border-blue-500 text-blue-600"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    <Squares2X2Icon className="h-5 w-5" />
    Portfolio
  </button>

  <button
  onClick={() => setActiveTab("ownauct")}
  className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
    activeTab === "ownauct"
      ? "border-b-4 border-blue-500 text-blue-600"
      : "hover:bg-gray-100 text-gray-600"
  }`}
>
  <TagIcon className="h-5 w-5" />
  Own Auction
</button>

</div>



        {/* Content Section */}
        {activeTab === "posts" && <OwnPost userId={user.id} />}
        {activeTab === "ownart" && <OwnArt userId={user.id} />}
        {activeTab === "portfolio" && (
          <PortfolioGrid portfolioItems={portfolioItems} loggedInUserId={user.id} />
        )}
        {activeTab === "ownauct" && <OwnAuct userId={user.id} />}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative">
              <button
                onClick={toggleUploadModal}
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
              <PortfolioUpload
                onSuccess={() => {
                  toggleUploadModal();
                }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
