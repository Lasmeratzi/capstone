const express = require("express");
const router = express.Router();
const { SignupController, upload } = require("../controllers/signupController");

// CREATE: Add a new user
router.post("/", upload.single("pfp"), SignupController.createUser);

// READ: Get all users
router.get("/", SignupController.getAllUsers);

router.get("/:username", SignupController.getUserByUsername);

// READ: Get a user by ID
router.get("/:id", SignupController.getUserById);

// UPDATE: Update a user's details
router.put("/:id", upload.single("pfp"), SignupController.updateUser);

// DELETE: Delete a user
router.delete("/:id", SignupController.deleteUser);

module.exports = router;