# ⚠️ Database Migration Needed: Add Role Column

## Problem
You're seeing this error:
```
Error fetching user role: "column users.role does not exist"
```

This means the `users` table in Supabase doesn't have a `role` column yet.

## Solution

### Quick Fix (Temporary)
✅ The app now handles this gracefully - it will default to 'general' role if the column doesn't exist.

### Permanent Fix (Recommended)
Run this SQL migration in your Supabase database:

#### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

#### Step 2: Run This SQL
```sql
-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'general';

-- Add constraint to ensure valid roles
ALTER TABLE users ADD CONSTRAINT valid_user_role 
  CHECK (role IN ('student', 'lecturer', 'general'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

#### Step 3: Execute
- Click "Run" button (or Ctrl+Enter)
- Should see "Success" message
- The role column is now added!

---

## What This Does

✅ Adds `role` column to `users` table  
✅ Sets default role to 'general'  
✅ Ensures only valid roles are allowed  
✅ Creates index for fast lookups  

---

## After Migration

- Users will now have roles (student, lecturer, general)
- AI kindness ideas will be customized by role
- Music recommendations can consider user type
- Role selection on signup will work properly

---

## Testing After Migration

1. Create a new user account
2. Select a role (student/lecturer)
3. Open browser console (F12)
4. Should see: `"User role fetched: student"` (or lecturer)
5. Check dashboard - ideas should be role-specific

---

## If You Can't Access Supabase

Alternative: Ask your database admin to run the SQL above.

The app will continue working with default 'general' role until the column is added.

---

## SQL File Location

If you need the full SQL later, it's at:
- `ADD_ROLE_COLUMN.sql` (in project root)

Just copy the content and run in Supabase SQL Editor!
