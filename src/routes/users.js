const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowCounts,
} = require("../controllers/users"); // Import all controller functions

const { findUsersByName } = require("../models/user"); // Import search function
const router = express.Router();

// Follow a user
router.post("/follow", authenticateToken, follow);

// Unfollow a user
router.delete("/unfollow", authenticateToken, unfollow);

// Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing);

// Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers);

// Get follow stats for current user
router.get("/stats", authenticateToken, getFollowCounts);

// Find users by name or username
router.get("/search", authenticateToken, findUsersByName);

module.exports = router;
