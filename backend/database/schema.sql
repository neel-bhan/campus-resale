-- Create users table for campus resale platform
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
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a test user (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password, name, role, university) 
VALUES (
    'test@university.edu', 
    '$2b$10$rQzX8Qj4vV8pHjK9zN2yLOxBzK9yH4tJ6mP3qR1sT5uV7wX9zA0b2', 
    'Test Student',
    'student',
    'University Name'
) ON CONFLICT (email) DO NOTHING;
