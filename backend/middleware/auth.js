const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  // Verify token
  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Add user info to request object
      req.user = user;
      next(); // Continue to next middleware/route handler
    }
  );
};

module.exports = {
  authenticateToken,
};
