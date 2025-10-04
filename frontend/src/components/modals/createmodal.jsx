import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  PaintBrushIcon,
  PencilSquareIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const CreateModal = ({ onClose, onSelect }) => {
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const options = [
    {
      key: "art",
      label: "Artwork",
      description: "Share your original artwork with the community.",
      icon: PaintBrushIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      key: "post",
      label: "Post",
      description: "Write a post, share updates, or start a discussion.",
      icon: PencilSquareIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      key: "auction",
      label: "Auction",
      description: "Start an auction to sell your artwork.",
      icon: BanknotesIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 max-w-lg w-full border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Create New</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map(({ key, label, description, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-400 transition bg-white text-center group"
            >
              <div className={`p-3 rounded-full mb-2 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition">
                {label}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full py-2 mt-4 border rounded-lg text-red-500 font-medium transition
                     hover:bg-red-500 hover:text-white hover:border-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateModal;
