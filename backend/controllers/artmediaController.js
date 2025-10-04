const artmediaModels = require("../models/artmediaModels");

// Add media to an artwork post
const addArtworkMedia = (req, res) => {
  const postId = req.body.post_id;
  const files = req.files; // Multer's array("media") handles multiple files

  if (!postId || !files || files.length === 0) {
    return res.status(400).json({ message: "Post ID and media files are required." });
  }

  const mediaEntries = files.map((file) => ({
  post_id: postId,
  media_path: file.filename,
}));


  const insertMedia = () => {
    let completed = 0;
    mediaEntries.forEach((mediaData) => {
      artmediaModels.addArtworkMedia(mediaData, (err) => {
        if (err) return res.status(500).json({ message: "Database error.", error: err });
        completed++;
        if (completed === mediaEntries.length) {
          res.status(201).json({ message: "Artwork media uploaded successfully!" });
        }
      });
    });
  };

  insertMedia();
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