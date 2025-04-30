import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import PortfolioUpload from "../portfolioupload/portfolioupload"; // Correctly import PortfolioUpload form
import { CloudArrowUpIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid"; // Use Heroicons v2 solid icons

const Profile = () => {
  const [user, setUser] = useState(null);
  const [commissions, setCommissions] = useState("closed");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For clicked item (to show modal, buttons, etc.)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For editing modal visibility

  // Fetch user profile and portfolio items
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const userResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        setCommissions(userResponse.data.commissions);

        // Fetch portfolio items
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommissions(newStatus);
    } catch (error) {
      console.error("Failed to update commissions status:", error);
    }
  };

  const toggleUploadModal = () => setIsUploadModalOpen(!isUploadModalOpen); // Toggle upload modal

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the item from the portfolioItems state
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      setSelectedItem(null); // Reset selection
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
    }
  };

  const handleImageClick = (item) => {
    // Set the selected item for modal display
    setSelectedItem(item);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const closeModal = () => setSelectedItem(null);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-60 flex-grow px-14 py-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center">
            <div className="w-32">
              <img
                src={`http://localhost:5000/uploads/${user.pfp}`}
                alt={`${user.username}'s Profile`}
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-lg text-gray-600">{user.fullname}</p>
              <p className="text-sm text-gray-500">
                Birthdate: {new Date(user.birthdate).toLocaleDateString()}
              </p>

              {/* Commissions Section */}
              <div className="mt-4 flex items-center">
                <span className="text-gray-800 font-semibold mr-2">Commission:</span>
                <button
                  onClick={toggleCommissions}
                  className={`px-4 py-2 font-semibold rounded-lg shadow-lg ${
                    commissions === "open" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                  }`}
                >
                  {commissions === "open" ? "Open" : "Closed"}
                </button>
              </div>
            </div>
          </div>

          {/* Upload Portfolio Button */}
          <button
            onClick={toggleUploadModal}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
          >
            <CloudArrowUpIcon className="h-6 w-6 mr-2" />
            Upload Image
          </button>
        </div>

        {/* Portfolio Section */}
        <div className="grid grid-cols-3 gap-3">
          {portfolioItems.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">No portfolio items to display.</p>
          ) : (
            portfolioItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)} // Click to view larger image
                className="cursor-pointer"
              >
                <img
                  src={`http://localhost:5000/uploads/${item.image_path}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: "0px",
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Enlarged Image with Edit/Delete Buttons */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full flex relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
            >
              &times;
            </button>

            {/* Enlarged Image */}
            <div className="w-2/3 flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/${selectedItem.image_path}`}
                alt={selectedItem.title}
                className="w-full h-auto"
              />
            </div>

            {/* Title, Description, Edit, and Delete Buttons */}
            <div className="w-1/3 pl-6 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-gray-800 mb-4">{selectedItem.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedItem.description}</p>
              <button
                onClick={toggleEditModal}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center mb-2"
              >
                <PencilSquareIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(selectedItem.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
{/* Edit Portfolio Modal */}
{isEditModalOpen && selectedItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
      {/* Close Button */}
      <button
        onClick={toggleEditModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
      >
        &times;
      </button>
      {/* Edit PortfolioUpload Form */}
      <PortfolioUpload
        portfolioItem={selectedItem}
        onSuccess={() => {
          // Close the modal and navigate back to /profile
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  </div>
)}

           {/* Upload Portfolio Modal */}
           {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            {/* Close Button */}
            <button
              onClick={toggleUploadModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
            >
              &times;
            </button>

            {/* PortfolioUpload Form */}
            <PortfolioUpload />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;