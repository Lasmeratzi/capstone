const db = require("../config/database");

// ✅ Get admin by username, ensuring role retrieval
const getAdminByUsername = (username) => {
    const sql = `SELECT id, username, password, role FROM admins WHERE username = ?`;

    return new Promise((resolve, reject) => {
        db.query(sql, [username], (err, results) => {
            if (err) {
                console.error("Database error in getAdminByUsername:", err);
                reject(err);
            } else {
                if (!results.length) {
                    console.warn(`Admin not found: ${username}`); // ✅ Log missing admin
                }
                resolve(results[0] || null); // ✅ Return only the first row, not an array
            }
        });
    });
};

// ✅ Create an admin manually (Now ensures role validation)
const createAdmin = (username, password, role = "admin") => {
    const validRoles = ["admin", "super_admin"]; // ✅ Define allowed roles

    if (!validRoles.includes(role)) {
        console.error(`Invalid role specified: ${role}`); // ✅ Log invalid role attempt
        throw new Error("Invalid role specified");
    }

    const sql = `INSERT INTO admins (username, password, role) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.query(sql, [username, password, role], (err, results) => {
            if (err) {
                console.error("Admin creation error:", err);
                reject(err);
            } else {
                console.log(`Admin created successfully: ${username}, Role: ${role}`); // ✅ Log success
                resolve(results);
            }
        });
    });
};

// ✅ Delete an admin account safely
const deleteAdmin = (adminId) => {
    const sql = `DELETE FROM admins WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.query(sql, [adminId], (err, results) => {
            if (err) {
                console.error("Admin deletion error:", err);
                reject(err);
            } else {
                console.log(`Admin deleted successfully: ID ${adminId}`); // ✅ Log success
                resolve(results);
            }
        });
    });
};

module.exports = { getAdminByUsername, createAdmin, deleteAdmin };