const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { register, login, getProfile } = require("../controllers/auth");

// Register new user
router.post("/register", register);

// Authenticate user
router.post("/login", login);

// Get authenticated user's profile
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
