// TODO: Implement users controller
// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

const FollowModel = require("../models/follow");
const logger = require("../utils/logger");

// TODO: Implement follow function
const follow = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    if (req.user.id.toString() === user_id.toString()) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }
    const isFollowing = await FollowModel.isFollowing(req.user.id, user_id);
    if (isFollowing) {
      return res.status(409).json({ error: "Already following this user" });
    }
    const result = await FollowModel.followUser(req.user.id, user_id);
    res.status(201).json({ message: "Followed user", follow: result });
  } catch (error) {
    logger.critical("Follow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement unfollow function
const unfollow = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    const isFollowing = await FollowModel.isFollowing(req.user.id, user_id);
    if (!isFollowing) {
      return res.status(404).json({ error: "Not following this user" });
    }
    await FollowModel.unfollowUser(req.user.id, user_id);
    res.json({ message: "Unfollowed user" });
  } catch (error) {
    logger.critical("Unfollow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getMyFollowing function
const getMyFollowing = async (req, res) => {
  try {
    const following = await FollowModel.getFollowing(req.user.id);
    res.json({ following });
  } catch (error) {
    logger.critical("Get following error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getMyFollowers function
const getMyFollowers = async (req, res) => {
  try {
    const followers = await FollowModel.getFollowers(req.user.id);
    res.json({ followers });
  } catch (error) {
    logger.critical("Get followers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getFollowCounts function
const getFollowCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await FollowModel.getFollowers(userId);
    const following = await FollowModel.getFollowing(userId);
    res.json({
      followers: followers.length,
      following: following.length,
    });
  } catch (error) {
    logger.critical("Get follow counts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowCounts,
};
