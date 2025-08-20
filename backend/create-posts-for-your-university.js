const { pool } = require("./config/database");

// Get your user ID and university
async function createPostsForYourUniversity() {
  try {
    console.log("🔍 Finding your user...");

    // List users with their universities
    const users = await pool.query(
      "SELECT id, name, university FROM users WHERE university IS NOT NULL AND university != '' ORDER BY id"
    );

    console.log("📋 Available users:");
    users.rows.forEach((user, index) => {
      console.log(
        `${index + 1}. ID: ${user.id}, Name: ${user.name}, University: ${
          user.university
        }`
      );
    });

    // For now, let's use the latest user (probably you)
    const latestUser = users.rows[users.rows.length - 1];
    console.log(
      `\n🎯 Using user: ${latestUser.name} from ${latestUser.university}`
    );

    // Sample post for your university
    const samplePost = {
      title: "React Development Laptop",
      description:
        "Perfect laptop for frontend development. Runs React apps smoothly!",
      price: 899.99,
      category: "Electronics",
      contact_method: "email",
      location: "Campus Center",
      images: ["http://localhost:3001/images/temp.jpeg"],
    };

    const result = await pool.query(
      `INSERT INTO posts (title, description, price, category, seller_id, university, images, contact_method, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        samplePost.title,
        samplePost.description,
        samplePost.price,
        samplePost.category,
        latestUser.id,
        latestUser.university,
        samplePost.images,
        samplePost.contact_method,
        samplePost.location,
      ]
    );

    console.log(
      `\n✅ Created post: "${result.rows[0].title}" for ${latestUser.university}`
    );
    console.log(`📍 Post ID: ${result.rows[0].id}`);

    console.log(`\n🔑 To test in your frontend, login with:`);
    console.log(`Email: Look up user ID ${latestUser.id}'s email in database`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

createPostsForYourUniversity();
