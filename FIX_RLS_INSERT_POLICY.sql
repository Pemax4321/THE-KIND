-- FIX: Add missing INSERT policy for users table
-- This allows users to create their own profile after auth signup

-- Drop existing INSERT policy if it exists (should not exist yet)
DROP POLICY IF EXISTS "Users can create their own profile" ON users;

-- Create the INSERT policy for users table
-- This allows authenticated users to insert their own profile row
CREATE POLICY "Users can create their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify the policy exists
SELECT * FROM pg_policies WHERE tablename = 'users';
