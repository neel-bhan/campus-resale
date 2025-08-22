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
