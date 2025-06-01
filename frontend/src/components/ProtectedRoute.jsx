import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenValid = () => {
    try {
      if (!token) return false;

      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime; // Check expiration
    } catch (error) {
      return false; // Invalid token format
    }
  };

  const isAuthenticated = isTokenValid();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;