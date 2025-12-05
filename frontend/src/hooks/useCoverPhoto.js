import { useState, useEffect } from 'react'; // Add useEffect
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const useCoverPhoto = (refreshProfile, initialCoverPhoto = null, setCoverPhotoState = null) => { // Add parameters
  const [coverPhoto, setCoverPhoto] = useState(initialCoverPhoto); // Use initial value
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [coverImageLoadError, setCoverImageLoadError] = useState(false);

  // Update local state when initialCoverPhoto changes
  useEffect(() => {
    if (initialCoverPhoto !== coverPhoto) {
      setCoverPhoto(initialCoverPhoto);
    }
  }, [initialCoverPhoto]);

  const handleCoverPhotoSelect = (file) => {
    if (!file) return;
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Please choose an image smaller than 10MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    setCoverPhotoFile(file);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    const url = URL.createObjectURL(file);
    setCoverPreviewUrl(url);
    setCoverImageLoadError(false);
  };

  const handleCoverPhotoUpload = async () => {
    if (!coverPhotoFile) return;
    setIsCoverUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("cover_photo", coverPhotoFile);

    try {
      const resp = await axios.post(`${BASE_URL}/api/profile/cover-photo`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setCoverPhoto(resp.data.cover_photo);
      // Also update parent state if setter provided
      if (setCoverPhotoState) {
        setCoverPhotoState(resp.data.cover_photo);
      }
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
        setCoverPreviewUrl(null);
      }
      setCoverPhotoFile(null);
      
      // Refresh profile to get updated data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to upload cover photo:", error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('File too large')) {
        alert('File is too large. Please choose an image smaller than 10MB.');
      } else if (error.response?.status === 400) {
        alert(error.response.data.message || 'Invalid file. Please try again.');
      } else if (error.response?.status === 500) {
        alert('Server error. Please try again.');
      } else {
        alert('Failed to upload cover photo. Please try again.');
      }
      return false;
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleCoverCancelSelection = () => {
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(null);
    }
    setCoverPhotoFile(null);
  };

  const handleRemoveCoverPhoto = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${BASE_URL}/api/profile/cover-photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cover photo removal response:", response.data);
      setCoverPhoto(null);
      // Also update parent state if setter provided
      if (setCoverPhotoState) {
        setCoverPhotoState(null);
      }
      
      // Refresh profile to get updated data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to remove cover photo:", error);
      
      if (error.response?.status === 400) {
        console.log("No cover photo found in database, updating locally...");
        setCoverPhoto(null);
        if (setCoverPhotoState) {
          setCoverPhotoState(null);
        }
        return true;
      } else {
        try {
          console.log("Trying PATCH method to remove cover photo...");
          await axios.patch(
            `${BASE_URL}/api/profile`,
            { cover_photo: null },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCoverPhoto(null);
          if (setCoverPhotoState) {
            setCoverPhotoState(null);
          }
          
          // Refresh profile to get updated data
          if (refreshProfile) {
            await refreshProfile();
          }
          
          return true;
        } catch (patchError) {
          console.error("Fallback method also failed:", patchError);
          setCoverPhoto(null);
          if (setCoverPhotoState) {
            setCoverPhotoState(null);
          }
          return true;
        }
      }
    }
  };

  return {
    // State
    coverPhoto,
    coverPhotoFile,
    coverPreviewUrl,
    isCoverUploading,
    coverImageLoadError,
    
    // Setters
    setCoverPhoto,
    setCoverImageLoadError,
    
    // Functions
    handleCoverPhotoSelect,
    handleCoverPhotoUpload,
    handleCoverCancelSelection,
    handleRemoveCoverPhoto
  };
};

export { useCoverPhoto };