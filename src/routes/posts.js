const express = require("express");
const { validateRequest, createPostSchema } = require("../utils/validation");
const {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  update,
  search
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Create new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// Get current user's posts
router.get("/my", authenticateToken, getMyPosts);

// Get single post by ID
router.get("/:post_id", optionalAuth, getById);

// Get posts by specific user
router.get("/user/:user_id", optionalAuth, getUserPosts);

// Delete a post
router.delete("/:post_id", authenticateToken, remove);

// Get content feed (followed users + own posts)
router.get("/feed", authenticateToken, getFeed);

// Update a post
router.put("/:post_id", authenticateToken, update);

// Search posts by content
router.get("/search", optionalAuth, search);

module.exports = router;