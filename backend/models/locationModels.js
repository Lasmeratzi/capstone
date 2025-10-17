const db = require("../config/database");

const getAllLocations = (callback) => {
  const sql = `
    SELECT id, name, province 
    FROM locations
    ORDER BY province, name
  `;
  db.query(sql, callback);
};

// Search locations by name or province
const searchLocations = (query, callback) => {
  const sql = `
    SELECT l.id, l.name, l.province, 
           (SELECT COUNT(*) FROM users u WHERE u.location_id = l.id) as artist_count
    FROM locations l
    WHERE l.name LIKE ? OR l.province LIKE ?
    ORDER BY l.province, l.name
    LIMIT 20
  `;
  db.query(sql, [`%${query}%`, `%${query}%`], callback);
};

// Get posts by location ID
const getPostsByLocationId = (locationId, callback) => {
  const sql = `
    SELECT ap.*, u.username as author, u.fullname, u.pfp as author_pfp 
    FROM artwork_posts ap
    JOIN users u ON ap.author_id = u.id
    WHERE u.location_id = ?
    ORDER BY ap.created_at DESC
  `;
  db.query(sql, [locationId], callback);
};

// Get location by ID
const getLocationById = (locationId, callback) => {
  const sql = `
    SELECT id, name, province
    FROM locations 
    WHERE id = ?
  `;
  db.query(sql, [locationId], callback);
};

// Get artist count for a location
const getArtistCountByLocation = (locationId, callback) => {
  const sql = `
    SELECT COUNT(*) as artist_count 
    FROM users 
    WHERE location_id = ?
  `;
  db.query(sql, [locationId], callback);
};

module.exports = { 
  getAllLocations, 
  searchLocations, 
  getPostsByLocationId,
  getLocationById,
  getArtistCountByLocation
};