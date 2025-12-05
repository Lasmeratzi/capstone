import { useState, useEffect } from 'react'; // Add useEffect
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const useWatermark = (refreshProfile, initialWatermark = null, setWatermarkState = null) => { // Add parameters
  const [watermark, setWatermark] = useState(initialWatermark); // Use initial value
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Update local state when initialWatermark changes
  useEffect(() => {
    if (initialWatermark !== watermark) {
      setWatermark(initialWatermark);
    }
  }, [initialWatermark]);

  const handleWatermarkSelect = (file) => {
    if (!file) return;
    setWatermarkFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageLoadError(false);
  };

  const handleWatermarkUpload = async () => {
    if (!watermarkFile) return;
    setIsUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("watermark", watermarkFile);

    try {
      const resp = await axios.post(`${BASE_URL}/api/profile/watermark`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serverFilename = resp.data?.watermark_path ?? resp.data?.watermark ?? null;
      if (serverFilename) {
        setWatermark(serverFilename);
        // Also update parent state if setter provided
        if (setWatermarkState) {
          setWatermarkState(serverFilename);
        }
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setWatermarkFile(null);
      
      // Refresh profile to get updated data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to upload watermark:", error);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setWatermarkFile(null);
  };

  const handleDeleteWatermark = async () => {
    if (!watermark) return;
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/profile/watermark`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatermark(null);
      // Also update parent state if setter provided
      if (setWatermarkState) {
        setWatermarkState(null);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setWatermarkFile(null);
      
      // Refresh profile to get updated data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to delete watermark:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // State
    watermark,
    watermarkFile,
    previewUrl,
    isUploading,
    isDeleting,
    imageLoadError,
    
    // Setters
    setWatermark,
    setImageLoadError,
    
    // Functions
    handleWatermarkSelect,
    handleWatermarkUpload,
    handleCancelSelection,
    handleDeleteWatermark
  };
};

export { useWatermark };