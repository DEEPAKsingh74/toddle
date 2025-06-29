const {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
} = require("../models/user");
const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger");

/* Register a new user */
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = await createUser({ username, email, password, full_name });

    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    logger.verbose(`New user registered: ${username}`);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    });
  } catch (error) {
    // Handle duplicate email (since the PostgreSQL error code for duplicates is 23505)
    if (error.code === '23505') {
      return res.status(409).json({ error: "Email already exists" });
    }
    logger.critical("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    logger.verbose(`User logged in: ${username}`);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    });
  } catch (error) {
    logger.critical("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    // Fetch latest user info from DB for consistency
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    logger.critical("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
