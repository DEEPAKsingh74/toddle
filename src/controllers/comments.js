// TODO: Implement comments controller
// This controller should handle:
// - Creating comments on posts
// - Editing user's own comments
// - Deleting user's own comments
// - Getting comments for a post
// - Pagination for comments

const CommentModel = require("../models/comment");
const logger = require("../utils/logger");

// TODO: Implement createComment function
const createComment = async (req, res) => {
  try {
    const { post_id, content, parent_comment_id = null } = req.body;
    const comment = await CommentModel.createComment({
      post_id,
      user_id: req.user.id,
      content,
      parent_comment_id,
    });
    res.status(201).json(comment);
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(400).json({ error: error.message || "Failed to create comment" });
  }
};

// TODO: Implement updateComment function
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const updated = await CommentModel.updateComment({
      comment_id: id,
      user_id: req.user.id,
      content,
    });
    if (!updated) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }
    res.json(updated);
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// TODO: Implement deleteComment function
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CommentModel.deleteComment({
      comment_id: id,
      user_id: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }
    res.status(204).end();
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

// TODO: Implement getPostComments function
const getPostComments = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let comments = await CommentModel.getPostComments(post_id);

    // Simple pagination in-memory (for demo; for large data, paginate in SQL)
    comments = comments.slice(offset, offset + parseInt(limit));
    res.json(comments);
  } catch (error) {
    logger.critical("Get post comments error:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
};