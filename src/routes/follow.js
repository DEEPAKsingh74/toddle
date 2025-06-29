const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowStats
} = require("../controllers/follow");

const router = express.Router();

router.post("/", authenticateToken, followUser);
router.delete("/", authenticateToken, unfollowUser);
router.get("/following", authenticateToken, getFollowing);
router.get("/followers", authenticateToken, getFollowers);
router.get("/stats", authenticateToken, getFollowStats);

module.exports = router;
