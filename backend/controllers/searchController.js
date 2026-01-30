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
        locations: [],
        portfolio: []  // ADD THIS
      },
      counts: {
        users: 0,
        tags: 0,
        locations: 0,
        portfolio: 0,  // ADD THIS
        total: 0
      },
      message: "Search query is required"
    });
  }

  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length < 1) {
    return res.status(200).json({
      query: trimmedQuery,
      results: {
        users: [],
        tags: [],
        locations: [],
        portfolio: []  // ADD THIS
      },
      counts: {
        users: 0,
        tags: 0,
        locations: 0,
        portfolio: 0,  // ADD THIS
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

    const users = results.users || [];
    const tags = results.tags || [];
    const locations = results.locations || [];
    const portfolio = results.portfolio || [];  // ADD THIS
    
    const totalCount = users.length + tags.length + locations.length + portfolio.length;  // UPDATE THIS

    res.status(200).json({
      query: trimmedQuery,
      results: {
        users: users,
        tags: tags,
        locations: locations,
        portfolio: portfolio  // ADD THIS
      },
      counts: {
        users: users.length,
        tags: tags.length,
        locations: locations.length,
        portfolio: portfolio.length,  // ADD THIS
        total: totalCount
      },
      ...(totalCount === 0 && { message: "No results found" })
    });
  });
};


// Quick search for real-time suggestions
const quickSearch = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 1) {
    return res.status(200).json({
      results: [],
      count: 0,
      message: "Type at least 1 character to search"
    });
  }

  const trimmedQuery = query.trim();

  searchModels.quickSearch(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Quick search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const searchResults = results || [];

    res.status(200).json({
      query: trimmedQuery,
      results: searchResults,
      count: searchResults.length,
      ...(searchResults.length === 0 && { message: "No suggestions found" })
    });
  });
};

// Search only users
const searchUsersOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      message: "Search query is required.",
      results: [],
      count: 0
    });
  }

  const trimmedQuery = query.trim();

  searchModels.searchUsers(trimmedQuery, (err, results) => {
    if (err) {
      console.error("User search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const users = results || [];

    res.status(200).json({
      query: trimmedQuery,
      results: users,
      count: users.length,
      ...(users.length === 0 && { message: "No users found" })
    });
  });
};

// Search only tags
const searchTagsOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      message: "Search query is required.",
      results: [],
      count: 0
    });
  }

  const trimmedQuery = query.trim();

  searchModels.searchTags(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Tag search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const tags = results || [];

    res.status(200).json({
      query: trimmedQuery,
      results: tags,
      count: tags.length,
      ...(tags.length === 0 && { message: "No tags found" })
    });
  });
};

// Search only locations
const searchLocationsOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      message: "Search query is required.",
      results: [],
      count: 0
    });
  }

  const trimmedQuery = query.trim();

  searchModels.searchLocations(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Location search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const locations = results || [];

    res.status(200).json({
      query: trimmedQuery,
      results: locations,
      count: locations.length,
      ...(locations.length === 0 && { message: "No locations found" })
    });
  });
};

const searchPortfolioOnly = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      message: "Search query is required.",
      results: [],
      count: 0
    });
  }

  const trimmedQuery = query.trim();

  searchModels.searchPortfolio(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Portfolio search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const portfolioItems = results || [];

    res.status(200).json({
      query: trimmedQuery,
      results: portfolioItems,
      count: portfolioItems.length,
      ...(portfolioItems.length === 0 && { message: "No portfolio items found" })
    });
  });
};

module.exports = {
  universalSearch,
  quickSearch,
  searchUsersOnly,
  searchTagsOnly,
  searchLocationsOnly,
  searchPortfolioOnly,
};