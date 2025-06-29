const {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts
} = require("../models/post");
const logger = require("../utils/logger");

/**
 * Create a new post
 */
const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled = true } = req.body;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled
    });

    logger.verbose(`User ${userId} created post ${post.id}`);
    res.status(201).json(post);
  } catch (error) {
    logger.critical("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID
 */
const getById = async (req, res) => {
  try {
    const post = await getPostById(req.params.post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts by a specific user
 */
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const posts = await getPostsByUserId(user_id, limit, offset);
    res.json(posts);
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's posts
 */
const getMyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const posts = await getPostsByUserId(req.user.id, limit, offset);
    res.json(posts);
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post
 */
const remove = async (req, res) => {
  try {
    const deleted = await deletePost(req.params.post_id, req.user.id);
    if (!deleted) return res.status(404).json({ error: "Post not found or unauthorized" });
    res.status(204).end();
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get content feed (posts from followed users + own posts)
 */
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const posts = await getFeedPosts(req.user.id, limit, offset);
    res.json(posts);
  } catch (error) {
    logger.critical("Get feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a post
 */
const update = async (req, res) => {
  try {
    const updated = await updatePost(
      req.params.post_id,
      req.user.id,
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Post not found or unauthorized" });
    res.json(updated);
  } catch (error) {
    logger.critical("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search posts by content
 */
const search = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!q) return res.status(400).json({ error: "Search query required" });
    
    const posts = await searchPosts(q, limit, offset);
    res.json(posts);
  } catch (error) {
    logger.critical("Search posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  update,
  search
};
