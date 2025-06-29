const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");


/* Middleware function to authenticate JWT tokens coming in request named with key : authorization */

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];

		const decoded = verifyToken(authHeader); /*else it gives 401 error*/

		if (!authHeader) {
			return res.status(401).json({ error: "Access token required" });
		}

		const user = await getUserById(decoded.userId);
		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		logger.critical("Authentication error:", error.message);
		return res.status(403).json({ error: "Invalid or expired token" });
	}
};

/**
 * Middleware to optionally authenticate tokens , no authentication required in these calls
 */
const optionalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];

		if (authHeader) {
			const decoded = verifyToken(authHeader);
			const user = await getUserById(decoded.userId);
			if (user) {
				req.user = user;
			}
		}

		next();
	} catch (error) {
		// Ignore auth errors for optional auth
		next();
	}
};

module.exports = {
	authenticateToken,
	optionalAuth,
};
