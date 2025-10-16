const searchModels = require("../models/searchModels");

// Universal search - searches users, tags, and locations
const universalSearch = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(200).json({
      query: "",
      results: {
        users: [],
        tags: [],
        locations: []
      },
      counts: {
        users: 0,
        tags: 0,
        locations: 0,
        total: 0
      }
    });
  }

  const trimmedQuery = query.trim();
  
  // If query is too short, return empty results with suggestion
  if (trimmedQuery.length < 1) {
    return res.status(200).json({
      query: trimmedQuery,
      results: {
        users: [],
        tags: [],
        locations: []
      },
      counts: {
        users: 0,
        tags: 0,
        locations: 0,
        total: 0
      },
      message: "Type at least 1 character to search"
    });
  }

  searchModels.universalSearch(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Universal search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json({
      query: trimmedQuery,
      results: {
        users: results.users || [],
        tags: results.tags || [],
        locations: results.locations || []
      },
      counts: {
        users: results.users?.length || 0,
        tags: results.tags?.length || 0,
        locations: results.locations?.length || 0,
        total: (results.users?.length || 0) + (results.tags?.length || 0) + (results.locations?.length || 0)
      }
    });
  });
};

// Quick search for real-time suggestions
const quickSearch = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 1) {
    return res.status(200).json([]);
  }

  const trimmedQuery = query.trim();

  searchModels.quickSearch(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Quick search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results || []);
  });
};

// Search only users (for backward compatibility)
const searchUsersOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Search query is required." });
  }

  searchModels.searchUsers(query.trim(), (err, results) => {
    if (err) {
      console.error("User search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results);
  });
};

// Search only tags
const searchTagsOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Search query is required." });
  }

  searchModels.searchTags(query.trim(), (err, results) => {
    if (err) {
      console.error("Tag search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results);
  });
};

// Search only locations
const searchLocationsOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Search query is required." });
  }

  searchModels.searchLocations(query.trim(), (err, results) => {
    if (err) {
      console.error("Location search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  universalSearch,
  quickSearch,
  searchUsersOnly,
  searchTagsOnly,
  searchLocationsOnly,
};