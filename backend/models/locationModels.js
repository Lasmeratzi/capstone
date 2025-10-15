const db = require("../config/database");

const getAllLocations = (callback) => {
  const sql = `
    SELECT id, name, province  /* Remove the AS barangay alias */
    FROM locations
    ORDER BY province, name
  `;
  db.query(sql, callback);
};

module.exports = { getAllLocations };
