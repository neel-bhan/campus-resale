const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

// Helper function to generate JWT tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );
};

// User Registration
const registerUser = async (req, res) => {
  try {
    const { email, password, name, university } = req.body;

    // Validation
    if (!email || !password || !name || !university) {
      return res.status(400).json({
        success: false,
        message: "Email, password, name, and university are required",
      });
    }

    // Check if user already exists
    const existingUserQuery = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUserQuery.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUserQuery = await pool.query(
      "INSERT INTO users (email, password, name, university, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, university, role, created_at",
      [email, hashedPassword, name, university, "student"]
    );

    const newUser = newUserQuery.rows[0];

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          university: newUser.university,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email in database
    const userQuery = await pool.query(
      "SELECT id, email, password, name, role FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userQuery.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user from database
    const userQuery = await pool.query(
      "SELECT id, email, name, role, university, phone, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userQuery.rows[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          university: user.university,
          phone: user.phone,
          createdAt: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Public Profile (Public Route)
const getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // Get user from database
    const userQuery = await pool.query(
      "SELECT id, name, role, university FROM users WHERE id = $1",
      [userId]
    );
    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const user = userQuery.rows[0];
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          university: user.university,
        },
      },
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Profile (Protected Route)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, university, phone } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    // Update user in database
    await pool.query(
      "UPDATE users SET name = $1, university = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
      [name, university, phone, userId]
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Change Password (Protected Route)
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user from database
    const userQuery = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const user = userQuery.rows[0];
    // Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedNewPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete User (Protected Route)
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete user from database
    const deleteQuery = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [userId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  getPublicProfile,
  updateProfile,
  deleteUser,
};
