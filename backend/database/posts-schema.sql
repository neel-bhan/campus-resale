-- Posts table schema for Campus Resale marketplace
-- This creates the main posts table and extends users table with favorites

-- First, add favorites column to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS favorites INTEGER[] DEFAULT '{}';

-- Create posts table
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
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_seller_id ON posts(seller_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_university ON posts(university);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Insert some sample categories (we'll use these as reference)
-- Note: We're storing categories as simple strings, not in a separate table
COMMENT ON COLUMN posts.category IS 'Categories: Textbooks, Electronics, Sports Tickets, Furniture, Clothing, Other';

-- Insert some sample posts for testing
INSERT INTO posts (title, description, price, category, seller_id, university, images, contact_method, course) 
VALUES 
    ('Calculus Textbook', 'Stewart Calculus 8th edition. Great condition, no highlighting.', 89.99, 'Textbooks', 1, 'Stanford University', '{"textbook1.jpg","textbook2.jpg"}', 'email', 'MATH 41'),
    ('iPhone 13', 'Barely used iPhone 13, 128GB. Includes original box and charger.', 599.99, 'Electronics', 1, 'Stanford University', '{"iphone1.jpg","iphone2.jpg"}', 'phone', NULL)
ON CONFLICT DO NOTHING;
