const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // ✅ Ensure password security
const Admin = require("../models/adminModels");
require("dotenv").config();

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    console.log("Incoming Admin Login Request:", req.body);

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }

    try {
        const admin = await Admin.getAdminByUsername(username);
        console.log("DB Query Result:", admin); // ✅ Expecting an object

        if (!admin) {  
            console.warn(`Admin not found: ${username}`); // ✅ Log missing admin
            return res.status(401).json({ message: "Admin not found." });
        }

        // ✅ Secure password comparison using bcrypt
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            console.warn(`Invalid password attempt for admin: ${username}`);
            return res.status(401).json({ message: "Invalid admin credentials." });
        }

        console.log(`Admin Role: ${admin.role}`);

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        console.log(`Admin ${username} logged in successfully.`); // ✅ Log success

        return res.json({ message: "Admin login successful", token, role: admin.role });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { loginAdmin };