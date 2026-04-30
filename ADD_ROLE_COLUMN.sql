-- Add role column to users table for storing user roles
-- Roles: 'student', 'lecturer', 'general'

ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'general';

-- Add constraint to ensure valid roles
ALTER TABLE users ADD CONSTRAINT valid_user_role 
  CHECK (role IN ('student', 'lecturer', 'general'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
