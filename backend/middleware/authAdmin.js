const jwt = require("jsonwebtoken");
require("dotenv").config(); // ✅ Load environment variables

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.admin = decoded;

        console.log(`Authenticated Admin: ${req.admin.username}, Role: ${req.admin.role || "Role Missing"}`); // ✅ Debugging

        if (!req.admin.role) {
            return res.status(403).json({ message: "Admin role not found in token!" });
        }

        if (!req.admin.role) {
    return res.status(403).json({ message: "Admin role not found in token!" });
}

if (req.admin.role === "super_admin" || req.admin.role === "admin") {
    console.log(`Authenticated Admin: ${req.admin.username}, Role: ${req.admin.role}`);
    return next();
}

return res.status(403).json({ message: "Insufficient permissions" });

    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateAdmin;