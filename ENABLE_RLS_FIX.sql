-- SECURITY FIX: Enable RLS on all tables that have policies
-- This script fixes the "Policy Exists RLS Disabled" critical security warning

-- 1. Enable RLS on essential tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kindness_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_kindness_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- 2. Ensure users table has all necessary RLS policies
-- Drop old policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create/recreate the policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Verify and ensure policies are active on other tables
DO $$ 
BEGIN
    -- Check and recreate policies if missing
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kindness_acts' AND policyname = 'System acts are visible to all, user acts only to owner') THEN
        CREATE POLICY "System acts are visible to all, user acts only to owner" 
          ON kindness_acts FOR SELECT USING (is_system = TRUE OR auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kindness_acts' AND policyname = 'Users can create kindness acts') THEN
        CREATE POLICY "Users can create kindness acts" 
          ON kindness_acts FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kindness_acts' AND policyname = 'Users can update their own acts') THEN
        CREATE POLICY "Users can update their own acts" 
          ON kindness_acts FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_kindness_ideas' AND policyname = 'Users can create custom ideas') THEN
        CREATE POLICY "Users can create custom ideas" 
          ON custom_kindness_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_kindness_ideas' AND policyname = 'Users can update their own ideas') THEN
        CREATE POLICY "Users can update their own ideas" 
          ON custom_kindness_ideas FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reflections' AND policyname = 'Users can create reflections') THEN
        CREATE POLICY "Users can create reflections" 
          ON reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'moods' AND policyname = 'Users can create mood entries') THEN
        CREATE POLICY "Users can create mood entries" 
          ON moods FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
