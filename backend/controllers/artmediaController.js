const artmediaModels = require("../models/artmediaModels");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

// Add media to an artwork post with watermark
const addArtworkMedia = async (req, res) => {
  const postId = req.body.post_id;
  const files = req.files;
  const userId = req.user.id; // Get logged-in user ID from auth token

  console.log("📝 Upload Request:", { postId, filesCount: files?.length, userId });

  if (!postId || !files || files.length === 0) {
    return res.status(400).json({ message: "Post ID and media files are required." });
  }

  try {
    // Get user's watermark path from database
    console.log("🔍 Fetching watermark for user:", userId);
    const userWatermark = await getUserWatermark(userId);
    console.log("💧 User watermark:", userWatermark || "None");
    
    // Process each image with watermark (if user has one)
    const processedFiles = [];
    
    for (const file of files) {
      console.log("📸 Processing file:", file.filename);
      let finalFilename = file.filename;
      
      // Only apply watermark if user has uploaded one
      if (userWatermark) {
        const watermarkPath = path.join(__dirname, "../uploads/watermarks", userWatermark);
        const originalImagePath = file.path;
        
        console.log("🎨 Watermark path:", watermarkPath);
        console.log("🖼️ Original image:", originalImagePath);
        
        // Check if watermark file exists
        try {
          await fs.access(watermarkPath);
          console.log("✅ Watermark file exists, applying...");
          
          // Apply watermark
          const watermarkedFilename = await applyWatermark(
            originalImagePath,
            watermarkPath,
            file.filename
          );
          
          finalFilename = watermarkedFilename;
          console.log("✨ Watermarked file created:", watermarkedFilename);
          
          // Delete original unwatermarked file
          await fs.unlink(originalImagePath);
          console.log("🗑️ Original file deleted");
        } catch (err) {
          console.log("⚠️ Watermark error (uploading without watermark):", err.message);
        }
      } else {
        console.log("ℹ️ No watermark for this user, uploading normally");
      }
      
      processedFiles.push({
        post_id: postId,
        media_path: finalFilename,
      });
    }

    console.log("💾 Saving to database:", processedFiles);

    // Insert all media entries into database
    let completed = 0;
    let hasError = false;
    
    processedFiles.forEach((mediaData) => {
      artmediaModels.addArtworkMedia(mediaData, (err) => {
        if (err && !hasError) {
          hasError = true;
          console.error("❌ Database error:", err);
          return res.status(500).json({ message: "Database error.", error: err });
        }
        completed++;
        if (completed === processedFiles.length && !hasError) {
          console.log("🎉 All files uploaded successfully!");
          res.status(201).json({ message: "Artwork media uploaded successfully!" });
        }
      });
    });

  } catch (error) {
    console.error("❌ Error processing images:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ message: "Error processing images", error: error.message });
  }
};

// Helper function to get user's watermark from database
const getUserWatermark = (userId) => {
  return new Promise((resolve, reject) => {
    const db = require("../config/database");
    db.query(
      "SELECT watermark_path FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0].watermark_path);
      }
    );
  });
};

// Helper function to apply watermark to image
const applyWatermark = async (imagePath, watermarkPath, originalFilename) => {
  try {
    // Load the main image
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Calculate watermark size (15% of image width)
    const watermarkWidth = Math.floor(metadata.width * 0.15);
    
    // Resize watermark to appropriate size
    const resizedWatermark = await sharp(watermarkPath)
      .resize(watermarkWidth, null, {
        fit: 'contain',
        withoutEnlargement: true
      })
      .toBuffer();
    
    // Get watermark dimensions after resize
    const watermarkMetadata = await sharp(resizedWatermark).metadata();
    
    // Position: lower-left with 20px padding
    const left = 20;
    const top = metadata.height - watermarkMetadata.height - 20;
    
    // Apply watermark
    const watermarkedFilename = `watermarked-${originalFilename}`;
    const outputPath = path.join(__dirname, "../uploads/artwork", watermarkedFilename);
    
    await image
      .composite([
        {
          input: resizedWatermark,
          top: top,
          left: left,
        }
      ])
      .toFile(outputPath);
    
    return watermarkedFilename;
  } catch (error) {
    console.error("Error applying watermark:", error);
    throw error;
  }
};

// Get all media for a specific artwork post
const getArtworkMediaByPostId = (req, res) => {
  const { postId } = req.params;
  artmediaModels.getArtworkMediaByPostId(postId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Delete all media for an artwork post
const deleteArtworkMediaByPostId = (req, res) => {
  const { postId } = req.params;
  artmediaModels.deleteArtworkMediaByPostId(postId, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Artwork media deleted successfully!" });
  });
};

const deleteSingleArtworkMedia = (req, res) => {
  const { mediaId } = req.params;
  artmediaModels.deleteArtworkMediaById(mediaId, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Artwork media deleted successfully!" });
  });
};

module.exports = {
  addArtworkMedia,
  getArtworkMediaByPostId,
  deleteArtworkMediaByPostId,
  deleteSingleArtworkMedia,
};