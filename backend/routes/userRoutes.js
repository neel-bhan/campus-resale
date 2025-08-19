const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  getPublicProfile,
  updateProfile,
  deleteUser
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/:id", getPublicProfile); // Public profile view


// Protected routes (authentication required)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/profile", authenticateToken, deleteUser);

module.exports = router;
