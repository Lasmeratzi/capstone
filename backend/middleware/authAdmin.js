const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateAdmin = (req, res, next) => {
    console.log("🛡️ === authAdmin.js called ===");
    console.log("🛡️ Request URL:", req.originalUrl);
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No Bearer token in header");
        return res.status(403).json({ message: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🛡️ Token received (first 20 chars):", token.substring(0, 20) + "...");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Decoded token:", decoded);
        
        req.admin = decoded;

        console.log(`✅ Authenticated: ${req.admin.username}, Role: ${req.admin.role || "Role Missing"}`);

        if (!req.admin.role) {
            console.log("❌ No role in token");
            return res.status(403).json({ message: "Admin role not found in token!" });
        }

        if (req.admin.role === "super_admin" || req.admin.role === "admin") {
            console.log(`🎉 Authorized Admin: ${req.admin.username}, Role: ${req.admin.role}`);
            return next();
        }

        console.log(`❌ Insufficient role: ${req.admin.role}`);
        return res.status(403).json({ message: "Insufficient permissions" });

    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateAdmin;