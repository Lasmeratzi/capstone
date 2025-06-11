import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const adminRole = sessionStorage.getItem("adminRole"); // ✅ Only admins have roles

  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // ✅ Decode JWT
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime; // ✅ Check expiration
    } catch (error) {
      console.error("Invalid admin token format. Clearing token.");
      return false;
    }
  };

  const isAuthenticated = isTokenValid(adminToken);

  // ✅ If no valid admin token, redirect to admin login
  if (!isAuthenticated) {
    console.warn("No valid admin token found. Redirecting to loginadmin.");
    return <Navigate to="/loginadmin" replace />;
  }

  // ✅ Admin-only access: Block unauthorized roles
  if (adminRole !== "admin" && adminRole !== "super_admin") {
    console.warn("Unauthorized admin access. Redirecting.");
    return <Navigate to="/loginadmin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;