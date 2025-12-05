const express = require("express");
const authenticateAdmin = require("../middleware/authAdmin");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const illuraAccountController = require("../controllers/illuraAccountController");

const router = express.Router();

// Super Admin only routes
router.get("/admin/illura-account", authenticateAdmin, illuraAccountController.getIlluraAccount);
router.put("/admin/illura-account", authenticateAdmin, uploadMiddleware.single("qr_code"), illuraAccountController.updateIlluraAccount);

// Public route for buyers to get GCash info
router.get("/illura-gcash", illuraAccountController.getIlluraGCashInfo);

module.exports = router;