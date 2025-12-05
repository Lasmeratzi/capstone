import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const useProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [commissions, setCommissions] = useState("closed");
  const [watermark, setWatermark] = useState(null); // Add watermark state
  const [coverPhoto, setCoverPhoto] = useState(null); // Add cover photo state

  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const userResponse = await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("🔍 FULL USER DATA FROM API:", userResponse.data); // ADD THIS
    console.log("🔍 GCASH NUMBER:", userResponse.data.gcash_number); // ADD THIS
    
    const userData = userResponse.data;
    
    setUser(userData);
    setSelectedLocation(userData.location_id || null);
    setCommissions(userData.commissions || "closed");
    
    // Set watermark and cover photo from user data
    const wm = userData.watermark_path ?? userData.watermark ?? null;
    setWatermark(wm);
    setCoverPhoto(userData.cover_photo || null);
    
    return userData;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Locations response:", res.data);
      const locationsData = Array.isArray(res.data) ? res.data : res.data.locations || [];
      setLocations(locationsData);
      return locationsData;
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  const formData = new FormData();
  
  // Add ALL fields that might be sent
  if (profileData.username !== undefined) formData.append("username", profileData.username);
  if (profileData.bio !== undefined) formData.append("bio", profileData.bio);
  if (profileData.location_id !== undefined) formData.append("location_id", profileData.location_id);
  if (profileData.pfp) formData.append("pfp", profileData.pfp);
  
  // ADD SOCIAL MEDIA FIELDS:
  if (profileData.twitter_link !== undefined) formData.append("twitter_link", profileData.twitter_link || "");
  if (profileData.instagram_link !== undefined) formData.append("instagram_link", profileData.instagram_link || "");
  if (profileData.facebook_link !== undefined) formData.append("facebook_link", profileData.facebook_link || "");

  try {
    await axios.patch(`${BASE_URL}/api/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchProfile(); // Refresh profile data
    return true;
  } catch (error) {
    console.error("Failed to update profile:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const updateCommissions = async (newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${BASE_URL}/api/profile/commissions`,
        { commissions: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProfile(); // Refresh profile data
      return true;
    } catch (error) {
      console.error("Failed to update commissions status:", error);
      return false;
    }
  };

  // Add this function to manually refresh profile
  const refreshProfile = async () => {
    return await fetchProfile();
  };

  // Function to update watermark state
  const setWatermarkState = (newWatermark) => {
    setWatermark(newWatermark);
  };

  // Function to update cover photo state
  const setCoverPhotoState = (newCoverPhoto) => {
    setCoverPhoto(newCoverPhoto);
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        await fetchProfile();
        await fetchLocations();
      } catch (error) {
        console.error("Failed to initialize profile:", error);
      }
    };

    initializeProfile();
  }, []);

  return {
    // State
    user,
    isLoading,
    locations,
    selectedLocation,
    commissions,
    watermark, // Return watermark
    coverPhoto, // Return cover photo
    
    // Setters
    setSelectedLocation,
    setCommissions,
    setWatermarkState, // Return setter
    setCoverPhotoState, // Return setter
    
    // Functions
    fetchProfile,
    fetchLocations,
    updateProfile,
    updateCommissions,
    refreshProfile
  };
};

export { useProfile };