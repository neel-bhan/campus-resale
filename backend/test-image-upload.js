// Test script to verify image upload functionality
const fs = require("fs");

async function testImageUpload() {
  try {
    // First, login to get a token
    const loginResponse = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "sarita@wisc.edu",
        password: "password123",
      }),
    });

    if (!loginResponse.ok) {
      throw new Error("Login failed");
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log("✅ Login successful");

    // Read the image file
    const imageBuffer = fs.readFileSync("./temp.jpeg");

    // Create FormData
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    formData.append("image", blob, "temp.jpeg");

    // Upload image to post ID 23 (React laptop post)
    const uploadResponse = await fetch(
      "http://localhost:3001/api/posts/23/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("❌ Upload failed:", error);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log("✅ Image upload successful!");
    console.log("📸 Image URL:", uploadData.data.imageUrl);
    console.log("📊 Total images:", uploadData.data.totalImages);

    // Verify the post now has the image
    const postResponse = await fetch("http://localhost:3001/api/posts/23");
    const postData = await postResponse.json();

    console.log("\n📋 Post images after upload:");
    console.log(postData.data.post.images);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testImageUpload();
