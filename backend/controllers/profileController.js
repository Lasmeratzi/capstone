const signupModels = require("../models/signupModels");
const fs = require("fs");
const path = require("path");

// Get logged-in user's profile with verification status
const getUserProfile = (req, res) => {
  const userId = req.user.id;

  signupModels.getUserWithVerificationStatusById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "User not found." });

    const user = results[0];
    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      bio: user.bio,
      birthdate: user.birthdate,
      pfp: user.pfp,
      watermark_path: user.watermark_path || null,
      account_status: user.account_status,
      commissions: user.commissions,
      verification_request_status: user.verification_request_status || "none",
      isVerified: user.verification_request_status === "approved",
      twitter_link: user.twitter_link,
      instagram_link: user.instagram_link,
      facebook_link: user.facebook_link,
      location_id: user.location_id,
      location_name: user.location_name,
      location_province: user.location_province,
    });
  });
};

// Fetch any user's profile by ID (with verification status)
const getUserProfileById = (req, res) => {
  const { id } = req.params;

  signupModels.getUserWithVerificationStatusById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "User not found." });

    const user = results[0];
    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      bio: user.bio,
      birthdate: user.birthdate,
      pfp: user.pfp,
      watermark_path: user.watermark_path || null,
      account_status: user.account_status,
      commissions: user.commissions,
      verification_request_status: user.verification_request_status || "none",
      isVerified: user.verification_request_status === "approved",
      twitter_link: user.twitter_link,
      instagram_link: user.instagram_link,
      facebook_link: user.facebook_link,
      location_id: user.location_id,
      location_name: user.location_name,
      location_province: user.location_province,
    });
  });
};

// Toggle commissions status
const toggleCommissions = (req, res) => {
  const userId = req.user.id;
  const { commissions } = req.body;

  if (!["open", "closed"].includes(commissions)) {
    return res.status(400).json({ message: "Invalid commissions value." });
  }

  signupModels.updateCommissions(userId, commissions, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Commissions status updated successfully!" });
  });
};

// Search users by username
const searchUsers = (req, res) => {
  const { query } = req.query;

  signupModels.searchUsers(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "No users found." });

    res.status(200).json(results);
  });
};

// Update profile
const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { username, bio, pfp, location_id } = req.body;

  if (!username && !bio && !pfp && !location_id) {
    return res.status(400).json({ message: "At least one field is required for update." });
  }

  // Validate location_id if provided (must be an integer)
  if (location_id && isNaN(parseInt(location_id))) {
    return res.status(400).json({ message: "Invalid location_id." });
  }

  signupModels.updateUser(
    userId,
    { username, bio, pfp, location_id },
    (err) => {
      if (err) {
        console.error("Database error updating profile:", err);
        return res.status(500).json({ message: "Database error.", error: err });
      }

      res.status(200).json({ message: "Profile updated successfully!" });
    }
  );
};

// ✅ Upload or replace watermark
const uploadWatermark = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "No watermark file uploaded." });
  }

  const watermarkPath = req.file.filename;

  signupModels.updateUser(userId, { watermark_path: watermarkPath }, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Watermark uploaded successfully!", watermark_path: watermarkPath });
  });
};

// ✅ Delete watermark (safe and clean)
const deleteWatermark = (req, res) => {
  const userId = req.user.id;

  signupModels.getUserById(userId, (err, results) => {
    if (err) {
      console.error("❌ DB error in deleteWatermark:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    // Add more detailed logging
    console.log("getUserById results:", results);
    
    if (!results || results.length === 0) {
      console.error("❌ User not found for ID:", userId);
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const watermarkPath = user.watermark_path;

    console.log("Watermark path from DB:", watermarkPath);

    if (!watermarkPath) {
      return res.status(400).json({ message: "No watermark to delete." });
    }

    const filePath = path.resolve(__dirname, `../uploads/watermarks/${watermarkPath}`);
    console.log("Attempting to delete file at:", filePath);

    // Delete file first, then update DB
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("⚠️ Error deleting watermark file (continuing anyway):", unlinkErr);
      } else {
        console.log("✅ Watermark file deleted successfully");
      }

      // Update DB regardless of file deletion result
      signupModels.updateUser(userId, { watermark_path: null }, (updateErr) => {
        if (updateErr) {
          console.error("❌ DB error updating watermark_path:", updateErr);
          return res.status(500).json({ message: "Database error.", error: updateErr });
        }

        console.log("✅ Watermark deleted from database");
        return res.status(200).json({ message: "Watermark deleted successfully." });
      });
    });
  });
};


module.exports = {
  getUserProfile,
  getUserProfileById,
  toggleCommissions,
  searchUsers,
  updateProfile,
  uploadWatermark,
  deleteWatermark,
};
