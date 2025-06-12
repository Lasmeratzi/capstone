import React from "react";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-bold text-red-600">
        Access Denied: Your account is not active.
      </h1>
    </div>
  );
};

export default Forbidden;