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
  const { username, bio, pfp } = req.body;

  if (!username && !bio && !pfp) {
    return res.status(400).json({ message: "At least one field is required for update." });
  }

  signupModels.updateUser(userId, { username, bio, pfp }, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Profile updated successfully!" });
  });
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

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const watermarkPath = results[0].watermark_path;

    if (!watermarkPath) {
      return res.status(400).json({ message: "No watermark to delete." });
    }

    const filePath = path.resolve(__dirname, `../uploads/watermarks/${watermarkPath}`);

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.warn("⚠️ Watermark file not found:", filePath);
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("❌ Error deleting watermark file:", unlinkErr);
        });
      }

      signupModels.updateUser(userId, { watermark_path: null }, (updateErr) => {
        if (updateErr) {
          console.error("❌ DB error updating watermark_path:", updateErr);
          return res.status(500).json({ message: "Database error.", error: updateErr });
        }

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
