const express = require("express");
const router = express.Router();
const { getAllTags, createTag, updateTag, deleteTag } = require("../controllers/tagController");

// Route to fetch all tags
router.get("/", getAllTags);

// Route to add a new tag
router.post("/", createTag);

// Route to update an existing tag
router.put("/:id", updateTag); // Changed :tag_id to :id

// Route to delete an existing tag
router.delete("/:id", deleteTag); // Changed :tag_id to :id

module.exports = router;