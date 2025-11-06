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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000']; // Default to localhost for development

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

// Serve static files (images) from the backend directory
app.use("/images", express.static(path.join(__dirname)));

// Proxy route for S3 images to avoid CORS issues
app.get("/s3-images/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

    // Create S3 client for this request
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Get object from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
    });

    const response = await s3Client.send(command);

    // Set proper headers for browser
    res.set("Content-Type", response.ContentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Stream the image data to browser
    response.Body.pipe(res);
  } catch (error) {
    console.error("Error proxying S3 image:", error);
    if (error.name === "NoSuchKey") {
      res.status(404).send("Image not found");
    } else {
      res.status(500).send("Error loading image");
    }
  }
});

// Routes
console.log("🔧 Registering routes...");
app.get("/api/health", (req, res) => {
  console.log("✅ Health endpoint hit!");
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});
console.log("✅ Health route registered");

// User authentication routes
app.use("/api/users", userRoutes);
console.log("✅ User routes registered");

// Post routes
app.use("/api/posts", postRoutes);
console.log("✅ Post routes registered");

// Catch-all for unmatched routes - should be LAST
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

// Start server and test database connection
app.listen(PORT, async () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log("🔄 Testing database connection...");
  await testConnection();
});
