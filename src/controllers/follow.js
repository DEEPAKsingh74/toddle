const FollowModel = require("../models/follow");
const logger = require("../utils/logger");

const followUser = async (req, res) => {
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
    res.status(201).json(result);
  } catch (error) {
    logger.critical("Follow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    
    const isFollowing = await FollowModel.isFollowing(req.user.id, user_id);
    if (!isFollowing) {
      return res.status(404).json({ error: "Not following this user" });
    }
    
    const result = await FollowModel.unfollowUser(req.user.id, user_id);
    res.json(result);
  } catch (error) {
    logger.critical("Unfollow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowing = async (req, res) => {
  try {
    const following = await FollowModel.getFollowing(req.user.id);
    res.json(following);
  } catch (error) {
    logger.critical("Get following error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const followers = await FollowModel.getFollowers(req.user.id);
    res.json(followers);
  } catch (error) {
    logger.critical("Get followers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowStats = async (req, res) => {
  try {
    const followers = await FollowModel.getFollowers(req.user.id);
    const following = await FollowModel.getFollowing(req.user.id);
    res.json({
      followers: followers.length,
      following: following.length
    });
  } catch (error) {
    logger.critical("Get follow stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowStats
};
