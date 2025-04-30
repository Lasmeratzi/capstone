import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated by verifying the token in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    // If authenticated, render the children (protected component)
    isAuthenticated ? children : <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;