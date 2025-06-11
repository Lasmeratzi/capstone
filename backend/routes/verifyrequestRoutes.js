const express = require("express");
const router = express.Router();
const verifyrequestController = require("../controllers/verifyrequestController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authenticateAdmin  = require("../middleware/authAdmin"); // For admins

// Submit a verification request (user)
router.post("/verifyrequest", authenticateToken, verifyrequestController.submitRequest);

// Get logged-in user's own request (user)
router.get("/verifyrequest", authenticateToken, verifyrequestController.getOwnRequest);

// Get all requests (admin only)
router.get("/verifyrequests", authenticateAdmin, verifyrequestController.getAllRequests);

// Update request status (admin only)
router.put("/verifyrequests/:id/status", authenticateAdmin, verifyrequestController.updateRequestStatus);

router.put("/verifyrequests/:id/approve", authenticateAdmin, verifyrequestController.approveRequest);

// Delete a verification request (admin only)
router.delete("/verifyrequests/:id", authenticateAdmin, verifyrequestController.deleteRequest);


module.exports = router;
