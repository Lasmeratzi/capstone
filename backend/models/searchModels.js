const db = require("../config/database");

// Search users by username, fullname, or location - prioritizing starts with
const searchUsers = (query, callback) => {
  const sql = `
    SELECT 
      u.id, 
      u.username, 
      u.fullname, 
      u.pfp, 
      u.bio,
      l.name as location_name,
      l.province as location_province,
      vr.status AS verification_status,
      'user' as type,
      CASE 
        WHEN u.username LIKE ? THEN 1  -- Username starts with query (highest priority)
        WHEN u.fullname LIKE ? THEN 2  -- Fullname starts with query
        WHEN l.name LIKE ? THEN 3      -- Location starts with query
        WHEN u.username LIKE ? THEN 4  -- Username contains query
        WHEN u.fullname LIKE ? THEN 5  -- Fullname contains query
        WHEN l.name LIKE ? THEN 6      -- Location contains query
        ELSE 7
      END as match_priority
    FROM users u
    LEFT JOIN locations l ON u.location_id = l.id
    LEFT JOIN verification_requests vr ON u.id = vr.user_id
    WHERE (u.username LIKE ? OR u.fullname LIKE ? OR l.name LIKE ? 
           OR u.username LIKE ? OR u.fullname LIKE ? OR l.name LIKE ?)
      AND u.account_status = 'active'
    ORDER BY 
      match_priority ASC,
      vr.status = 'approved' DESC, 
      u.username ASC
    LIMIT 10
  `;
  
  const startsWithPattern = `${query}%`;
  const containsPattern = `%${query}%`;
  
  db.query(sql, [
    startsWithPattern, startsWithPattern, startsWithPattern, // starts with patterns for priority
    containsPattern, containsPattern, containsPattern,       // contains patterns for priority
    startsWithPattern, startsWithPattern, startsWithPattern, // starts with patterns for WHERE
    containsPattern, containsPattern, containsPattern        // contains patterns for WHERE
  ], callback);
};

// Search tags by name - prioritizing starts with
const searchTags = (query, callback) => {
  const sql = `
    SELECT 
      t.id, 
      t.name,
      COUNT(at.id) as post_count,
      'tag' as type,
      CASE 
        WHEN t.name LIKE ? THEN 1  -- Tag name starts with query
        WHEN t.name LIKE ? THEN 2  -- Tag name contains query
        ELSE 3
      END as match_priority
    FROM tags t
    LEFT JOIN artwork_tags at ON t.id = at.tag_id
    WHERE t.name LIKE ? OR t.name LIKE ?
    GROUP BY t.id
    ORDER BY 
      match_priority ASC,
      post_count DESC
    LIMIT 10
  `;
  
  const startsWithPattern = `${query}%`;
  const containsPattern = `%${query}%`;
  
  db.query(sql, [
    startsWithPattern, containsPattern,  // for CASE priority
    startsWithPattern, containsPattern   // for WHERE clause
  ], callback);
};

// Search locations by name or province - prioritizing starts with
const searchLocations = (query, callback) => {
  const sql = `
    SELECT 
      l.id, 
      l.name as city,
      l.province,
      COUNT(u.id) as artist_count,
      'location' as type,
      CASE 
        WHEN l.name LIKE ? THEN 1      -- City name starts with query
        WHEN l.province LIKE ? THEN 2  -- Province starts with query
        WHEN l.name LIKE ? THEN 3      -- City name contains query
        WHEN l.province LIKE ? THEN 4  -- Province contains query
        ELSE 5
      END as match_priority
    FROM locations l
    LEFT JOIN users u ON l.id = u.location_id AND u.account_status = 'active'
    WHERE l.name LIKE ? OR l.province LIKE ? OR l.name LIKE ? OR l.province LIKE ?
    GROUP BY l.id
    ORDER BY 
      match_priority ASC,
      artist_count DESC
    LIMIT 10
  `;
  
  const startsWithPattern = `${query}%`;
  const containsPattern = `%${query}%`;
  
  db.query(sql, [
    startsWithPattern, startsWithPattern, containsPattern, containsPattern,  // for CASE priority
    startsWithPattern, startsWithPattern, containsPattern, containsPattern   // for WHERE clause
  ], callback);
};

// Enhanced universal search with better performance
const universalSearch = (query, callback) => {
  if (!query || query.length < 1) {
    return callback(null, {
      users: [],
      tags: [],
      locations: [],
      portfolio: [],  // ADD THIS
      suggestions: []
    });
  }

  // ADD PORTFOLIO TO Promise.all
  Promise.all([
    new Promise((resolve, reject) => {
      searchUsers(query, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      searchTags(query, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {
      searchLocations(query, (err, results) => err ? reject(err) : resolve(results));
    }),
    new Promise((resolve, reject) => {  // ADD THIS
      searchPortfolio(query, (err, results) => err ? reject(err) : resolve(results));
    })
  ])
  .then(([users, tags, locations, portfolio]) => {
    callback(null, {
      users: users || [],
      tags: tags || [],
      locations: locations || [],
      portfolio: portfolio || []  // ADD THIS
    });
  })
  .catch(err => {
    callback(err);
  });
};


// Quick search for real-time suggestions - prioritizing starts with
const quickSearch = (query, callback) => {
  if (!query || query.length < 1) {
    return callback(null, []);
  }

  const sql = `
    (SELECT id, username as name, pfp as image, 'user' as type, username as subtitle,
            CASE WHEN username LIKE ? THEN 1 ELSE 2 END as match_priority
     FROM users 
     WHERE (username LIKE ? OR username LIKE ?) AND account_status = 'active'
     ORDER BY match_priority ASC, username ASC
     LIMIT 2)  -- Reduced from 3 to 2 to make room
    
    UNION ALL
    
    (SELECT id, name, NULL as image, 'tag' as type, 
            CONCAT(COUNT(artwork_tags.id), ' posts') as subtitle,
            CASE WHEN name LIKE ? THEN 1 ELSE 2 END as match_priority
     FROM tags 
     LEFT JOIN artwork_tags ON tags.id = artwork_tags.tag_id
     WHERE name LIKE ? OR name LIKE ?
     GROUP BY tags.id
     HAVING COUNT(artwork_tags.id) > 0
     ORDER BY match_priority ASC, COUNT(artwork_tags.id) DESC
     LIMIT 2)  -- Reduced from 3 to 2
    
    UNION ALL
    
    (SELECT id, name as name, NULL as image, 'location' as type,
            CONCAT(COUNT(users.id), ' artists') as subtitle,
            CASE WHEN name LIKE ? THEN 1 ELSE 2 END as match_priority
     FROM locations 
     LEFT JOIN users ON locations.id = users.location_id AND users.account_status = 'active'
     WHERE name LIKE ? OR name LIKE ?
     GROUP BY locations.id
     HAVING COUNT(users.id) > 0
     ORDER BY match_priority ASC, COUNT(users.id) DESC
     LIMIT 2)  -- Reduced from 3 to 2
    
    UNION ALL
    
    (SELECT pi.id, pi.title as name, pi.image_path as image, 'portfolio' as type,
            u.username as subtitle,
            CASE WHEN pi.title LIKE ? THEN 1 ELSE 2 END as match_priority
     FROM portfolio_items pi
     JOIN users u ON pi.user_id = u.id
     WHERE u.account_status = 'active'
       AND (pi.title LIKE ? OR pi.title LIKE ?)
     ORDER BY match_priority ASC, pi.created_at DESC
     LIMIT 2)  -- ADD PORTFOLIO ITEMS
    
    ORDER BY match_priority ASC, type
    LIMIT 10
  `;
  
  const startsWithPattern = `${query}%`;
  const containsPattern = `%${query}%`;
  
  db.query(sql, [
    // Users
    startsWithPattern, startsWithPattern, containsPattern,
    // Tags
    startsWithPattern, startsWithPattern, containsPattern,
    // Locations
    startsWithPattern, startsWithPattern, containsPattern,
    // Portfolio
    startsWithPattern, startsWithPattern, containsPattern
  ], callback);
};

// Search portfolio items by title or description - prioritizing starts with
const searchPortfolio = (query, callback) => {
  const sql = `
    SELECT 
      pi.id, 
      pi.title,
      pi.description,
      pi.image_path,
      pi.user_id,
      pi.created_at,
      u.username,
      u.pfp,
      u.fullname,
      'portfolio' as type,
      CASE 
        WHEN pi.title LIKE ? THEN 1  -- Title starts with query (highest priority)
        WHEN pi.description LIKE ? THEN 2  -- Description starts with query
        WHEN pi.title LIKE ? THEN 3  -- Title contains query
        WHEN pi.description LIKE ? THEN 4  -- Description contains query
        ELSE 5
      END as match_priority
    FROM portfolio_items pi
    JOIN users u ON pi.user_id = u.id
    WHERE u.account_status = 'active'
      AND (pi.title LIKE ? OR pi.description LIKE ? OR pi.title LIKE ? OR pi.description LIKE ?)
    ORDER BY 
      match_priority ASC,
      pi.created_at DESC
    LIMIT 10
  `;
  
  const startsWithPattern = `${query}%`;
  const containsPattern = `%${query}%`;
  
  db.query(sql, [
    startsWithPattern, startsWithPattern, containsPattern, containsPattern,  // for CASE priority
    startsWithPattern, startsWithPattern, containsPattern, containsPattern   // for WHERE clause
  ], callback);
};

module.exports = {
  searchUsers,
  searchTags,
  searchLocations,
  universalSearch,
  quickSearch,
  searchPortfolio,
};