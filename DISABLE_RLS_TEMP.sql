-- TEMPORARY: Disable RLS to test if policies are the issue
-- This will let us verify the data fetching works

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE kindness_acts DISABLE ROW LEVEL SECURITY;
ALTER TABLE custom_kindness_ideas DISABLE ROW LEVEL SECURITY;
ALTER TABLE reflections DISABLE ROW LEVEL SECURITY;
ALTER TABLE moods DISABLE ROW LEVEL SECURITY;

-- All RLS disabled - now you should be able to fetch data
-- If this works, the issue is with the RLS policies
-- If it still doesn't work, the issue is something else
