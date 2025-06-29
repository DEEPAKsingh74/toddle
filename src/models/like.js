const { query } = require("../utils/database");

const LikeModel = {
  async likePost({ post_id, user_id }) {
    const result = await query(
      `INSERT INTO likes (post_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, post_id) DO NOTHING
       RETURNING *`,
      [post_id, user_id]
    );
    return result.rows[0];
  },

  async unlikePost({ post_id, user_id }) {
    const result = await query(
      `DELETE FROM likes
       WHERE post_id = $1 AND user_id = $2
       RETURNING *`,
      [post_id, user_id]
    );
    return result.rows[0];
  },

  async getPostLikes(post_id) {
    const result = await query(
      `SELECT * FROM likes
       WHERE post_id = $1`,
      [post_id]
    );
    return result.rows;
  },

  async getUserLikes(user_id) {
    const result = await query(
      `SELECT * FROM likes
       WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  },

  async hasUserLikedPost({ post_id, user_id }) {
    const result = await query(
      `SELECT 1 FROM likes
       WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id]
    );
    return result.rows.length > 0;
  }
};

module.exports = LikeModel;