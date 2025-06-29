const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a comment on a post
router.post("/", authenticateToken, createComment);

// Update a comment
router.put("/:id", authenticateToken, updateComment);

// Delete a comment
router.delete("/:id", authenticateToken, deleteComment);

// Get comments for a post
router.get("/post/:post_id", getPostComments);

module.exports = router;
