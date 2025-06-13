const postlikesModels = require("../models/postlikesModels");
const notificationsModels = require("../models/notificationsModels");
const db = require("../config/database");

// Like a post
const likePost = (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  postlikesModels.checkIfLiked(postId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (results.length) {
      return res.status(400).json({ message: "You already liked this post." });
    }

    // Proceed to add like
    postlikesModels.addLike(postId, userId, (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      // Get the author's userId from posts table
      const getPostAuthorQuery = "SELECT author_id FROM posts WHERE id = ?";
      db.query(getPostAuthorQuery, [postId], (err, authorResults) => {
        if (err || !authorResults.length) {
          console.error("Failed to find post author", err);
          return res.status(500).json({ message: "Failed to notify post author." });
        }

        const authorId = authorResults[0].author_id;

        // Now get the username of the user who liked
        const getUsernameQuery = "SELECT username FROM users WHERE id = ?";
        db.query(getUsernameQuery, [userId], (err, userResults) => {
          if (err || !userResults.length) {
            console.error("Failed to find user", err);
            return res.status(500).json({ message: "Failed to notify post author." });
          }

          const username = userResults[0].username;
          const message = `${username} liked your post`;

          // Create notification
          notificationsModels.createNotification(authorId, message);

          res.status(200).json({ message: "Post liked successfully!" });
        });
      });
    });
  });
};


// Unlike a post
const unlikePost = (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  postlikesModels.checkIfLiked(postId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (!results.length) {
      return res.status(400).json({ message: "You haven't liked this post yet." });
    }

    postlikesModels.removeLike(postId, userId, (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      res.status(200).json({ message: "Post unliked successfully!" });
    });
  });
};

// Get like count for a post
const getPostLikeCount = (req, res) => {
  const { postId } = req.params;

  postlikesModels.getLikeCount(postId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const likeCount = results[0].likeCount;
    res.status(200).json({ postId, likeCount });
  });
};

const checkIfUserLikedPost = (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  postlikesModels.hasUserLiked(postId, userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const liked = results[0].liked > 0;
    res.status(200).json({ liked });
  });
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikeCount,
  checkIfUserLikedPost, 
};
