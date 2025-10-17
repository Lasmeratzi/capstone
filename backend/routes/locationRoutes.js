const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const locationsController = require("../controllers/locationController");

// ✅ GET all locations
router.get("/", authenticateToken, locationsController.getAllLocations);

// ✅ GET all locations with artist counts
router.get("/with-counts", authenticateToken, locationsController.getLocationsWithCounts);

// ✅ SEARCH locations
router.get("/search", authenticateToken, locationsController.searchLocations);

// ✅ GET posts by location ID
router.get("/:locationId/posts", authenticateToken, locationsController.getPostsByLocation);

// ✅ GET location by ID
router.get("/:locationId", authenticateToken, locationsController.getLocationById);

// ✅ GET artist count for location
router.get("/:locationId/artist-count", authenticateToken, locationsController.getLocationArtistCount);

module.exports = router;