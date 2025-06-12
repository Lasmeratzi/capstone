const postsModels = require("../models/postsModels");

// Create a new post
const createPost = (req, res) => {
  console.log("POST /posts - Request received");
  const authorId = req.user.id;
  const { title } = req.body;
  const mediaPath = req.file ? req.file.filename : null;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const postData = { author_id: authorId, title, media_path: mediaPath, post_status: "active" };

  postsModels.createPost(postData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "Post created successfully!", postId: result.insertId });
  });
};

// Get all posts
const getAllPosts = (req, res) => {
  const authorId = req.query.author_id;

  postsModels.getAllPosts(authorId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results.map(post => ({
      ...post,
      author_id: post.author_id, // 🔥 Ensure author_id is included
      author_pfp: post.author_pfp || "default.png",
      post_status: post.post_status || "active"
    })));
  });
};



// Get posts by the logged-in user
const getUserPosts = (req, res) => {
  const authorId = req.user.id;

  postsModels.getPostsByAuthorId(authorId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get a post by ID
const getPostById = (req, res) => {
  const { id } = req.params;

  postsModels.getPostById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({
      ...result[0],
      author_id: result[0].author_id, // 🔥 Ensure author_id is included
      author_pfp: result[0].author_pfp || "default.png",
      post_status: result[0].post_status || "active"
    });
  });
};



// Update a post (Only if user is the author)
const updatePost = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const media = req.file ? req.file.filename : null;
  const authorId = req.user.id;

  postsModels.getPostById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Post not found." });

    const post = result[0];

    if (post.author_id !== authorId) {
      return res.status(403).json({ message: "Unauthorized to update this post." });
    }

    const updatedTitle = title || post.title;
    const updatedMediaPath = media || post.media_path;

    const postData = {
      title: updatedTitle,
      media_path: updatedMediaPath,
    };

    postsModels.updatePostById(id, postData, (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error.", error: updateErr });

      res.status(200).json({ message: "Post updated successfully." });
    });
  });
};

// Update post status (Admin moderation feature)
const updatePostStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "down"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  postsModels.updatePostStatus(id, status, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: `Post status updated to ${status}.` });
  });
};

// Delete a post (Only if user is the author)
const deletePost = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Ensure userId is coming from authentication

  if (!id) {
    return res.status(400).json({ message: "Post ID is required." });
  }

  postsModels.getPostById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Post not found." });

    if (result[0].author_id !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post." });
    }

    postsModels.deletePost(id, userId, (deleteErr) => {
      if (deleteErr) return res.status(500).json({ message: "Database error.", error: deleteErr });
      res.status(200).json({ message: "Post deleted successfully!" });
    });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  updatePostStatus,
  deletePost,
};