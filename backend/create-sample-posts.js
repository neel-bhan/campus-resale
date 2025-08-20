const { pool } = require("./config/database");

// Sample posts data with the temp.jpeg image
const samplePosts = [
  {
    title: "MacBook Pro 2021 - Excellent Condition",
    description:
      "Barely used MacBook Pro perfect for computer science students. Comes with original charger and box. Amazing performance for coding and development work.",
    price: 1299.99,
    category: "Electronics",
    contact_method: "email",
    course: "CS 106A",
    location: "Campus Library",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Calculus Textbook - Stewart 8th Edition",
    description:
      "Stewart Calculus 8th edition in great condition. All pages intact, minimal highlighting. Perfect for MATH 41 and 42.",
    price: 89.99,
    category: "Textbooks",
    contact_method: "phone",
    course: "MATH 41",
    location: "Student Center",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Stanford vs Cal Football Tickets",
    description:
      "Two premium seats for the Big Game! Section 20, row 15. Great view of the field. Can't make it due to family emergency.",
    price: 150.0,
    category: "Sports Tickets",
    contact_method: "email",
    event: "Stanford vs Cal Game",
    location: "Stanford Stadium",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "IKEA Desk Chair - Ergonomic",
    description:
      "Comfortable desk chair perfect for long study sessions. Adjustable height, good lumbar support. Moving out and need to sell quickly.",
    price: 45.0,
    category: "Furniture",
    contact_method: "phone",
    location: "Dorm Room",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Nike Air Force 1 - Size 10",
    description:
      "Classic white Nike Air Force 1 sneakers. Size 10, worn only a few times. Perfect condition, just too big for me.",
    price: 75.0,
    category: "Clothing",
    contact_method: "email",
    location: "Campus Bookstore Area",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "iPhone 13 Pro - Unlocked",
    description:
      "iPhone 13 Pro 128GB in space gray. Unlocked and ready to use. Screen protector and case included. Upgraded to iPhone 15.",
    price: 699.99,
    category: "Electronics",
    contact_method: "phone",
    location: "Engineering Quad",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Organic Chemistry Textbook Bundle",
    description:
      "Complete set of organic chemistry books including Clayden and practice problems. Essential for CHEM 33. Saved me hundreds!",
    price: 125.0,
    category: "Textbooks",
    contact_method: "email",
    course: "CHEM 33",
    location: "Science Library",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Warriors vs Lakers Tickets",
    description:
      "Two tickets to Warriors vs Lakers game at Chase Center. Lower bowl seats, incredible view. Can't attend due to finals.",
    price: 200.0,
    category: "Sports Tickets",
    contact_method: "phone",
    event: "Warriors vs Lakers",
    location: "Chase Center",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "Gaming Monitor - 27 inch 144Hz",
    description:
      "ASUS 27-inch gaming monitor with 144Hz refresh rate. Perfect for gaming and productivity. Excellent color accuracy for design work.",
    price: 250.0,
    category: "Electronics",
    contact_method: "email",
    location: "Tech Corner",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
  {
    title: "North Face Jacket - Medium",
    description:
      "Warm and waterproof North Face jacket, perfect for Bay Area weather. Medium size, barely worn. Great for outdoor activities.",
    price: 85.0,
    category: "Clothing",
    contact_method: "phone",
    location: "Outdoor Gear Exchange",
    images: ["http://localhost:3001/images/temp.jpeg"],
  },
];

async function createSamplePosts() {
  try {
    console.log("🚀 Creating sample posts...");

    // First, get a user to assign as seller (we'll use the first user)
    const userQuery = await pool.query(
      "SELECT id, university FROM users LIMIT 1"
    );

    if (userQuery.rows.length === 0) {
      console.log("❌ No users found! Please create a user first.");
      console.log("You can register a user through the API:");
      console.log(
        "POST /api/users/register with email, password, name, and university"
      );
      return;
    }

    const sellerId = userQuery.rows[0].id;
    const university = userQuery.rows[0].university;

    console.log(`📍 Using user ID ${sellerId} from ${university} as seller`);

    // Clear existing posts (optional - remove if you want to keep existing posts)
    await pool.query("DELETE FROM posts");
    console.log("🧹 Cleared existing posts");

    // Insert sample posts
    for (let i = 0; i < samplePosts.length; i++) {
      const post = samplePosts[i];

      const result = await pool.query(
        `INSERT INTO posts (title, description, price, category, seller_id, university, images, contact_method, course, event, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, title`,
        [
          post.title,
          post.description,
          post.price,
          post.category,
          sellerId,
          university,
          post.images,
          post.contact_method,
          post.course || null,
          post.event || null,
          post.location,
        ]
      );

      console.log(
        `✅ Created post ${i + 1}: "${result.rows[0].title}" (ID: ${
          result.rows[0].id
        })`
      );
    }

    console.log("\n🎉 Successfully created 10 sample posts!");
    console.log("📸 All posts include the temp.jpeg image");
    console.log("\n📋 Summary:");
    console.log("- 3 Electronics posts");
    console.log("- 2 Textbook posts");
    console.log("- 2 Sports Ticket posts");
    console.log("- 2 Clothing posts");
    console.log("- 1 Furniture post");

    console.log("\n🔍 Test your API:");
    console.log("GET /api/posts - to see all posts");
    console.log("GET /api/posts?category=Electronics - to filter by category");
  } catch (error) {
    console.error("❌ Error creating sample posts:", error);
  } finally {
    await pool.end();
  }
}

// Run the script
createSamplePosts();
