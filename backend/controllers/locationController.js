const locationModels = require("../models/locationModels");

// Get all locations
const getAllLocations = (req, res) => {
  locationModels.getAllLocations((err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({
      locations: results || [],
      count: results?.length || 0
    });
  });
};

// Search locations by name or province
const searchLocations = (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(200).json({
      query: "",
      results: [],
      count: 0,
      message: "Search query is required"
    });
  }

  const trimmedQuery = query.trim();
  
  // If query is too short, return empty results with suggestion
  if (trimmedQuery.length < 1) {
    return res.status(200).json({
      query: trimmedQuery,
      results: [],
      count: 0,
      message: "Type at least 1 character to search"
    });
  }

  locationModels.searchLocations(trimmedQuery, (err, results) => {
    if (err) {
      console.error("Location search error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json({
      query: trimmedQuery,
      results: results || [],
      count: results?.length || 0
    });
  });
};

// Get posts by location ID
const getPostsByLocation = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return res.status(400).json({ message: "Location ID is required." });
  }

  // First get location details
  locationModels.getLocationById(locationId, (err, locationResults) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (locationResults.length === 0) {
      return res.status(404).json({ 
        message: "Location not found",
        location: null,
        posts: [],
        postCount: 0
      });
    }

    // Then get posts from this location
    locationModels.getPostsByLocationId(locationId, (err, postResults) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({
        location: locationResults[0],
        posts: postResults || [],
        postCount: postResults?.length || 0
      });
    });
  });
};

// Get location by ID
const getLocationById = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return res.status(400).json({ message: "Location ID is required." });
  }

  locationModels.getLocationById(locationId, (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        message: "Location not found",
        location: null
      });
    }

    res.status(200).json({
      location: results[0]
    });
  });
};

// Get artist count for location
const getLocationArtistCount = (req, res) => {
  const { locationId } = req.params;

  if (!locationId) {
    return res.status(400).json({ message: "Location ID is required." });
  }

  locationModels.getArtistCountByLocation(locationId, (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    const artistCount = results[0]?.artist_count || 0;

    res.status(200).json({
      locationId: parseInt(locationId),
      artistCount: artistCount
    });
  });
};

// Get locations with artist counts
const getLocationsWithCounts = (req, res) => {
  locationModels.getAllLocations((err, locations) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no locations, return empty array
    if (!locations || locations.length === 0) {
      return res.status(200).json({
        locations: [],
        count: 0
      });
    }

    // Get artist counts for each location
    const locationPromises = locations.map(location => {
      return new Promise((resolve) => {
        locationModels.getArtistCountByLocation(location.id, (err, countResults) => {
          if (err) {
            resolve({
              ...location,
              artist_count: 0
            });
          } else {
            resolve({
              ...location,
              artist_count: countResults[0]?.artist_count || 0
            });
          }
        });
      });
    });

    Promise.all(locationPromises)
      .then(locationsWithCounts => {
        res.status(200).json({
          locations: locationsWithCounts,
          count: locationsWithCounts.length
        });
      })
      .catch(error => {
        console.error("Error processing location counts:", error);
        res.status(500).json({ message: "Error processing location data" });
      });
  });
};

module.exports = {
  getAllLocations,
  searchLocations,
  getPostsByLocation,
  getLocationById,
  getLocationArtistCount,
  getLocationsWithCounts
};