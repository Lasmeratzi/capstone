const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const searchController = require("../controllers/searchController");

const router = express.Router();

// Universal search endpoint (searches everything)
// GET /api/search/universal?query=bacolod
router.get("/search/universal", authenticateToken, searchController.universalSearch);

// Quick search for real-time suggestions
// GET /api/search/quick?query=t
router.get("/search/quick", authenticateToken, searchController.quickSearch);

// Individual search endpoints (optional, for specific needs)
// GET /api/search/users?query=maria
router.get("/search/users", authenticateToken, searchController.searchUsersOnly);

// GET /api/search/tags?query=portrait
router.get("/search/tags", authenticateToken, searchController.searchTagsOnly);

// GET /api/search/locations?query=bacolod
router.get("/search/locations", authenticateToken, searchController.searchLocationsOnly);

module.exports = router;