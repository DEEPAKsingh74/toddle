// TODO: Implement likes controller
// This controller should handle:
// - Liking posts
// - Unliking posts
// - Getting likes for a post
// - Getting posts liked by a user

const LikeModel = require("../models/like");
const logger = require("../utils/logger");

// TODO: Implement likePost function
const likePost = async (req, res) => {
  try {
    const { post_id } = req.body;
    if (!post_id) return res.status(400).json({ error: "post_id is required" });
    const result = await LikeModel.likePost({ post_id, user_id: req.user.id });
    if (!result) return res.status(409).json({ error: "Already liked" });
    res.status(201).json(result);
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement unlikePost function
const unlikePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const result = await LikeModel.unlikePost({ post_id, user_id: req.user.id });
    if (!result) return res.status(404).json({ error: "Like not found" });
    res.json({ success: true });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getPostLikes function
const getPostLikes = async (req, res) => {
  try {
    const { post_id } = req.params;
    const likes = await LikeModel.getPostLikes(post_id);
    res.json(likes);
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getUserLikes function
const getUserLikes = async (req, res) => {
  try {
    const { user_id } = req.params;
    const likes = await LikeModel.getUserLikes(user_id);
    res.json(likes);
  } catch (error) {
    logger.critical("Get user likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
};
