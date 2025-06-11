const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminLoginController");
const authenticateAdmin = require("../middleware/authAdmin"); // ✅ Enforce authentication

// ✅ Admin Login Route
router.post("/login/admin", loginAdmin);

// ✅ Protected Admin Dashboard Route
router.get("/admin-dashboard", authenticateAdmin, (req, res) => {
    console.log(`Admin Dashboard Access: ${req.admin.username}, Role: ${req.admin.role}`); // ✅ Debugging log
    res.json({ message: "Welcome Admin!", role: req.admin.role });
});

// ✅ Super Admin Restricted Route
router.get("/manageAdmins", authenticateAdmin, (req, res) => {
    if (req.admin.role !== "super_admin") {
        console.warn(`Unauthorized access attempt to manageAdmins by ${req.admin.username}`);
        return res.status(403).json({ message: "Access restricted to super admins only!" });
    }
    console.log(`Super Admin Access: ${req.admin.username}`);
    res.json({ message: "Welcome Super Admin!" });
});

module.exports = router;