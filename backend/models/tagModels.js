const db = require("../config/database"); // Import the database connection

const Tag = {
  // Fetch all tags
  getAll: (callback) => {
    const query = "SELECT * FROM tags"; // No changes needed here
    db.query(query, callback);
  },

  // Add a new tag
  create: (tag_name, tag_created, callback) => { // Removed tag_id
    const query = "INSERT INTO tags (tag_name, tag_created) VALUES (?, ?)"; // Updated query
    db.query(query, [tag_name, tag_created], callback);
  },

  // Update an existing tag
  update: (id, tag_name, tag_created, callback) => { // Changed tag_id to id
    const query = "UPDATE tags SET tag_name = ?, tag_created = ? WHERE id = ?"; // Updated query
    db.query(query, [tag_name, tag_created, id], callback);
  },

  // Remove a tag
  remove: (id, callback) => { // Changed tag_id to id
    const query = "DELETE FROM tags WHERE id = ?"; // Updated query
    db.query(query, [id], callback);
  },
};

module.exports = Tag;