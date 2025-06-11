const bcrypt = require("bcrypt");
const db = require("../config/database"); // Adjust path to match your project structure

const updateAdminPasswords = async () => {
    const admins = await new Promise((resolve, reject) => {
        db.query("SELECT id, password FROM admins", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });

    for (const admin of admins) {
        if (!admin.password.startsWith("$2b$")) { // ✅ Check if password is already hashed
            const hashedPassword = await bcrypt.hash(admin.password, 10);

            await new Promise((resolve, reject) => {
                db.query("UPDATE admins SET password = ? WHERE id = ?", [hashedPassword, admin.id], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            console.log(`Admin ID ${admin.id} password updated successfully.`);
        } else {
            console.log(`Admin ID ${admin.id} password is already hashed.`);
        }
    }
};

updateAdminPasswords().catch((err) => console.error("Error updating passwords:", err));