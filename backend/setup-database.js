const { pool } = require('./config/database');

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database tables...');
    
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
    await pool.query(`
      INSERT INTO users (email, password, name, role, university) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO NOTHING
    `, [
      'test@university.edu',
      '$2b$10$rQzX8Qj4vV8pHjK9zN2yLOxBzK9yH4tJ6mP3qR1sT5uV7wX9zA0b2',
      'Test Student',
      'student',
      'University Name'
    ]);

    console.log('✅ Database setup completed successfully!');
    console.log('📝 Test user created: test@university.edu (password: password123)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
};

setupDatabase();
