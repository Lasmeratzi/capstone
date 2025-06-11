const express = require("express");
const router = express.Router();
const { logoutAdmin } = require("../controllers/adminLogoutController");
const authenticateAdmin = require("../middleware/authAdmin"); // ✅ Ensure only authenticated admins can log out

// ✅ Admin Logout Route (Requires authentication)
router.post("/logout/admin", authenticateAdmin, logoutAdmin);

module.exports = router;