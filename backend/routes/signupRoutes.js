const express = require("express");
const router = express.Router();
const { SignupController, upload } = require("../controllers/signupController");

// CREATE: Add a new user
router.post("/", upload.single("pfp"), SignupController.createUser);

// READ: Get all users
router.get("/", SignupController.getAllUsers);

// UPDATE: Update account status (e.g., Activate/Put On Hold)
router.put("/:id/status", SignupController.updateAccountStatus);

// READ: Get a user by ID
router.get("/:id", SignupController.getUserById);

// READ: Get a user by username
router.get("/:username", SignupController.getUserByUsername);

// UPDATE: Update a user's details
router.put("/:id", upload.single("pfp"), SignupController.updateUser);

// DELETE: Delete a user
router.delete("/:id", SignupController.deleteUser);

module.exports = router;