const { query } = require("../utils/database");

// Create a new post
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at`,
    [user_id, content, media_url, comments_enabled],
  );
  return result.rows[0];
};

// Get post by ID
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = FALSE`,
    [postId],
  );
  return result.rows[0] || null;
};

// Get posts by user ID
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
  return result.rows;
};

// Delete a post (soft delete)
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = TRUE WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );
  return result.rowCount > 0;
};

// Get feed posts (posts from followed users and self)
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE (p.user_id IN (
        SELECT following_id FROM follows WHERE follower_id = $1
      ) OR p.user_id = $1)
      AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

// Update post (edit content/media/comments_enabled)
const updatePost = async (postId, userId, { content, media_url, comments_enabled }) => {
  const result = await query(
    `UPDATE posts
     SET content = COALESCE($1, content),
         media_url = COALESCE($2, media_url),
         comments_enabled = COALESCE($3, comments_enabled)
     WHERE id = $4 AND user_id = $5 AND is_deleted = FALSE
     RETURNING *`,
    [content, media_url, comments_enabled, postId, userId]
  );
  return result.rows[0];
};

// Search posts by content
const searchPosts = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = FALSE) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND p.is_deleted = FALSE
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
