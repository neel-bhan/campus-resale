require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { testConnection } = require("./config/database");

// Import routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (images) from the backend directory
app.use("/images", express.static(path.join(__dirname)));

// Routes
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// User authentication routes
app.use("/api/users", userRoutes);

// Post routes
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 3001;

// Start server and test database connection
app.listen(PORT, async () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log("🔄 Testing database connection...");
  await testConnection();
});
