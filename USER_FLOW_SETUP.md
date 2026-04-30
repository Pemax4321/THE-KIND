# User Flow Setup Guide

## Current User Flow

### New User Journey
1. **Landing Page** (`/start`) - "Small Acts. Real Impact."
   - "Get Started" button → Role Selection
   - "Log in" button → Login page

2. **Role Selection** (`/select-role`) - "Tell us about yourself"
   - Choose: Student, Lecturer, or General User
   - Role is stored in localStorage
   - "Continue" button → Signup page

3. **Sign Up** (`/signup`) - "Join us and start spreading kindness today"
   - Enter: Name, Email, Password
   - Role from localStorage is automatically attached
   - Account created in Supabase Auth
   - User profile saved to `users` table with role

4. **Dashboard** (`/`) - Personalized kindness experience
   - Role-specific kindness ideas displayed
   - Access to all app features

### Existing User Journey
1. **Login** (`/login`) - "Welcome back"
   - Enter: Email, Password
   - Redirects to Dashboard with role fetched from database

---

## Required Supabase Setup

### Step 1: Run the RLS Policy Fix

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `FIX_RLS_INSERT_POLICY.sql`
4. Click **Run**

This adds the missing INSERT policy for the `users` table:
```sql
CREATE POLICY "Users can create their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Why this is needed:**
- Row Level Security (RLS) is enabled on the `users` table
- Without an INSERT policy, Supabase blocks all insert attempts
- This policy allows authenticated users to insert their own profile row

### Step 2: Verify Your Schema

Ensure your `users` table has these columns:
- `id` (UUID, references auth.users)
- `email` (TEXT)
- `display_name` (TEXT)
- `role` (TEXT) - should be present if you ran the migration
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

If the `role` column is missing, run:
```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'general';
```

### Step 3: Test the Flow

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Get Started"
4. Select a role (you'll see it highlight)
5. Click "Continue"
6. Fill in Name, Email, Password
7. Click "Create Account"

**Expected behavior:**
- Role card highlights when clicked
- "Continue" button navigates to signup page
- Signup form loads with selected role
- Account created successfully
- Redirects to dashboard
- Role-specific ideas are displayed

---

## Troubleshooting

### Issue: "Error saving user profile" on signup
**Solution:** Add the INSERT policy from Step 1

### Issue: Role not persisting after login
**Solution:** Run migration to add `role` column to users table

### Issue: "Site can't be reached"
**Solution:** Check if dev server is running: `npm run dev`

### Issue: Button doesn't navigate
**Solution:** Check browser DevTools console for errors

---

## File Structure

- `app/start/page.tsx` - Landing page
- `app/select-role/page.tsx` - Role selection
- `app/signup/page.tsx` - Signup form
- `app/login/page.tsx` - Login form
- `app/page.tsx` - Dashboard (protected route)
- `lib/auth-context.tsx` - Auth state management
- `lib/kindness-ideas.ts` - Role-based idea definitions
