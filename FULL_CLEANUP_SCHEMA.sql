-- FULL CLEANUP - Nuclear Option
-- This removes EVERYTHING to start completely fresh
-- Use this if CLEANUP_SCHEMA.sql didn't fully work

-- Disable RLS temporarily to avoid permission issues
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kindness_acts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS custom_kindness_ideas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reflections DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS moods DISABLE ROW LEVEL SECURITY;

-- Drop ALL triggers
DROP TRIGGER IF EXISTS users_update_timestamp ON users CASCADE;
DROP TRIGGER IF EXISTS kindness_acts_update_timestamp ON kindness_acts CASCADE;
DROP TRIGGER IF EXISTS custom_ideas_update_timestamp ON custom_kindness_ideas CASCADE;
DROP TRIGGER IF EXISTS reflections_update_timestamp ON reflections CASCADE;
DROP TRIGGER IF EXISTS moods_update_timestamp ON moods CASCADE;

-- Drop ALL functions (including any that might be hidden)
DROP FUNCTION IF EXISTS update_users_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_kindness_acts_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_custom_ideas_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_reflections_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_moods_timestamp() CASCADE;

-- Drop ALL indexes
DROP INDEX IF EXISTS idx_kindness_acts_user_id CASCADE;
DROP INDEX IF EXISTS idx_kindness_acts_is_system CASCADE;
DROP INDEX IF EXISTS idx_kindness_acts_completed CASCADE;
DROP INDEX IF EXISTS idx_kindness_acts_created_at CASCADE;
DROP INDEX IF EXISTS idx_custom_ideas_user_id CASCADE;
DROP INDEX IF EXISTS idx_custom_ideas_created_at CASCADE;
DROP INDEX IF EXISTS idx_reflections_user_id CASCADE;
DROP INDEX IF EXISTS idx_reflections_created_at CASCADE;
DROP INDEX IF EXISTS idx_reflections_mood CASCADE;
DROP INDEX IF EXISTS idx_moods_user_id CASCADE;
DROP INDEX IF EXISTS idx_moods_created_at CASCADE;
DROP INDEX IF EXISTS idx_moods_user_date CASCADE;

-- Drop ALL RLS policies (on all tables)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "System acts are visible to all, user acts only to owner" ON kindness_acts;
DROP POLICY IF EXISTS "Users can create kindness acts" ON kindness_acts;
DROP POLICY IF EXISTS "Users can update their own acts" ON kindness_acts;
DROP POLICY IF EXISTS "Users can delete their own acts" ON kindness_acts;
DROP POLICY IF EXISTS "Users can only see their own custom ideas" ON custom_kindness_ideas;
DROP POLICY IF EXISTS "Users can create custom ideas" ON custom_kindness_ideas;
DROP POLICY IF EXISTS "Users can update their own ideas" ON custom_kindness_ideas;
DROP POLICY IF EXISTS "Users can delete their own ideas" ON custom_kindness_ideas;
DROP POLICY IF EXISTS "Users can only see their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can create reflections" ON reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can only see their own moods" ON moods;
DROP POLICY IF EXISTS "Users can create mood entries" ON moods;
DROP POLICY IF EXISTS "Users can delete their own mood entries" ON moods;

-- Drop ALL tables completely
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;
DROP TABLE IF EXISTS custom_kindness_ideas CASCADE;
DROP TABLE IF EXISTS kindness_acts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Done! Everything is gone. Now safe to run SUPABASE_SCHEMA_FIXED.sql
