const artworkpostlikesModels = require("../models/artworkpostlikesModels");
const notificationsModels = require("../models/notificationsModels");
const db = require("../config/database");

// Like artwork
const likeArtworkPost = (req, res) => {
  const userId = req.user.id;
  const { artworkPostId } = req.params;

  artworkpostlikesModels.checkIfLiked(artworkPostId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (results.length) return res.status(400).json({ message: "You already liked this artwork." });

    artworkpostlikesModels.addLike(artworkPostId, userId, (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      // Notify artwork author
      const getAuthorQuery = "SELECT author_id FROM artwork_posts WHERE id = ?";
      db.query(getAuthorQuery, [artworkPostId], (err, authorResults) => {
        if (err || !authorResults.length) return res.status(500).json({ message: "Failed to notify author." });

        const authorId = authorResults[0].author_id;

        const getUsernameQuery = "SELECT username FROM users WHERE id = ?";
        db.query(getUsernameQuery, [userId], (err, userResults) => {
          if (err || !userResults.length) return res.status(500).json({ message: "Failed to notify author." });

          const username = userResults[0].username;
          const message = `${username} liked your artwork`;

          notificationsModels.createNotification(authorId, message);

          res.status(200).json({ message: "Artwork liked successfully!" });
        });
      });
    });
  });
};

// Unlike artwork
const unlikeArtworkPost = (req, res) => {
  const userId = req.user.id;
  const { artworkPostId } = req.params;

  artworkpostlikesModels.checkIfLiked(artworkPostId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(400).json({ message: "You haven't liked this artwork yet." });

    artworkpostlikesModels.removeLike(artworkPostId, userId, (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      res.status(200).json({ message: "Artwork unliked successfully!" });
    });
  });
};

// Get like count
const getArtworkLikeCount = (req, res) => {
  const { artworkPostId } = req.params;

  artworkpostlikesModels.getLikeCount(artworkPostId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const likeCount = results[0].likeCount;
    res.status(200).json({ artworkPostId, likeCount });
  });
};

// Check if user liked
const checkIfUserLikedArtwork = (req, res) => {
  const userId = req.user.id;
  const { artworkPostId } = req.params;

  artworkpostlikesModels.hasUserLiked(artworkPostId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const liked = results[0].liked > 0;
    res.status(200).json({ liked });
  });
};

module.exports = {
  likeArtworkPost,
  unlikeArtworkPost,
  getArtworkLikeCount,
  checkIfUserLikedArtwork,
};
