const { query } = require("../utils/database");

const CommentModel = {
  async createComment({ post_id, user_id, content, parent_comment_id = null }) {
    const postRes = await query(
      "SELECT comments_enabled FROM posts WHERE id = $1 AND is_deleted = FALSE",
      [post_id]
    );
    if (!postRes.rows.length || postRes.rows[0].comments_enabled === false) {
      throw new Error("Comments are disabled for this post");
    }
    const result = await query(
      `INSERT INTO comments (post_id, user_id, content, parent_comment_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [post_id, user_id, content, parent_comment_id]
    );
    return result.rows[0];
  },

  async updateComment({ comment_id, user_id, content }) {
    const result = await query(
      `UPDATE comments
       SET content = $1
       WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE
       RETURNING *`,
      [content, comment_id, user_id]
    );
    return result.rows[0];
  },

  async deleteComment({ comment_id, user_id }) {
    const result = await query(
      `UPDATE comments
       SET is_deleted = TRUE
       WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
       RETURNING *`,
      [comment_id, user_id]
    );
    return result.rows[0];
  },

  async getPostComments(post_id) {
    const result = await query(
      `SELECT *
       FROM comments
       WHERE post_id = $1 AND is_deleted = FALSE
       ORDER BY created_at ASC`,
      [post_id]
    );
    return result.rows;
  },

  async getCommentById(comment_id) {
    const result = await query(
      `SELECT *
       FROM comments
       WHERE id = $1 AND is_deleted = FALSE`,
      [comment_id]
    );
    return result.rows[0];
  }
};

module.exports = CommentModel;