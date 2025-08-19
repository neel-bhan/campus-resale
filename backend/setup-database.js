const { pool } = require("./config/database");

const setupDatabase = async () => {
  try {
    console.log("🔧 Setting up database tables...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'student',
          university VARCHAR(255),
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    // Insert test user
    await pool.query(
      `
      INSERT INTO users (email, password, name, role, university) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO NOTHING
    `,
      [
        "test@university.edu",
        "$2b$10$rQzX8Qj4vV8pHjK9zN2yLOxBzK9yH4tJ6mP3qR1sT5uV7wX9zA0b2",
        "Test Student",
        "student",
        "University Name",
      ]
    );

    console.log("✅ Users table created successfully!");

    // Add favorites column to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS favorites INTEGER[] DEFAULT '{}'
    `);

    console.log("✅ Added favorites column to users table!");

    // Create posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          university VARCHAR(255) NOT NULL,
          images TEXT[] DEFAULT '{}',
          views INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
          contact_method VARCHAR(100),
          course VARCHAR(100),
          event VARCHAR(100),
          location VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Posts table created successfully!");

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_seller_id ON posts(seller_id);
      CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
      CREATE INDEX IF NOT EXISTS idx_posts_university ON posts(university);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    `);

    console.log("✅ Database indexes created successfully!");

    console.log("✅ Database setup completed successfully!");
    console.log(
      "📝 Test user created: test@university.edu (password: password123)"
    );
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  } finally {
    await pool.end();
  }
};

setupDatabase();
