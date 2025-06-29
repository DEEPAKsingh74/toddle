const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

// Fixed: Use hashedPassword instead of plain password for extra security 
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  //here we inserted the user into the database using template literals
  
  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name]  // Fixed parameter
  );
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const result = await query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
};

const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

//User search with partial matching
const findUsersByName = async (name, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name
     FROM users
     WHERE full_name ILIKE $1 OR username ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${name}%`, limit, offset]
  );
  return result.rows;
};

//User profile with follower stats
const getUserProfile = async (userId) => {
  const result = await query(
    `SELECT 
        u.id, u.username, u.full_name,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following
     FROM users u
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

// Implemented: Profile update function
const updateUserProfile = async (userId, { full_name, email }) => {
  const result = await query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         email = COALESCE($2, email)
     WHERE id = $3
     RETURNING id, username, email, full_name`,
    [full_name, email, userId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile
};
