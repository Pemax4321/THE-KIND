# Name Save Issue - Diagnostic Guide

## Issue
When updating display name, the "Saving..." loading indicator stays on indefinitely (never completes).

## Investigation Findings

### 1. **Frontend Code** (`/app/profile/page.tsx`)
- ✅ State management appears correct: `isSavingName` is properly set/reset
- ✅ Try/catch/finally block structure is sound
- **✗ ISSUE FOUND**: Two sequential API calls with no timeout protection
  - Auth update: `supabase.auth.updateUser()` 
  - Database update: `supabase.from("users").update()`
  - If either hangs, the finally block never executes

### 2. **RLS Policies** 
The `users` table needs two policies for profile updates to work:
```sql
-- For reading the profile
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

-- For updating the profile  
CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE USING (auth.uid() = id);

-- For initial profile creation (was MISSING)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);
```

### 3. **Root Cause Likely to be One of These:**

| Cause | Symptom | Fix |
|-------|---------|-----|
| **RLS Disabled** | All queries hang after 3-4 attempts | Run `ENABLE_RLS_FIX.sql` in Supabase |
| **Missing INSERT Policy** | Profile creation fails silently | Updated `ENABLE_RLS_FIX.sql` now includes this |
| **Auth Update Hanging** | Logs show "AUTH UPDATE" but never completes | Update frontend with timeout (✅ Done) |
| **DB Update Hanging** | Logs show "DB UPDATE" but never completes | Update frontend with timeout (✅ Done) |
| **RLS Policy Incorrect** | Auth succeeds but DB update denied | Supabase SQL editor shows error details |

## Action Plan

### Phase 1: Run Updated SQL Fix ⚠️ CRITICAL
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `ENABLE_RLS_FIX.sql`
4. Paste into SQL editor
5. Click **Run** 
6. ✅ Look for: "X rows affected" or "0 rows affected" (both are OK)
7. ❌ Look for: Any error messages (if you see errors, note them)

### Phase 2: Test with Enhanced Logging
The frontend has been updated with **detailed logging**. When you retry the name save:

1. Open **Browser DevTools** (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Try to save a name
4. Look for these log messages (in order):

```
🔵 [NAME SAVE START] Attempting to save name: [your name]
🟡 [AUTH UPDATE] Starting auth metadata update...
✅ [AUTH SUCCESS] Completed in XXXms
🟡 [DB UPDATE] Starting database update...
✅ [DB SUCCESS] Completed in XXXms...
✅ [NAME SAVE COMPLETE]
🟢 [SAVE STATE RESET] isSaving set to false
```

### Phase 3: Interpret Results

**If you see all green logs:** ✅ Problem solved! Run `ENABLE_RLS_FIX.sql` and test again.

**If you see logs stop at AUTH UPDATE:** 🔴 Auth update is hanging
- Error message will show: "Auth update timeout after 5s"
- **Action**: Check Supabase auth settings

**If you see logs stop at DB UPDATE:** 🔴 Database update is hanging  
- Error message will show: "DB update timeout after 5s" or specific SQL error
- **Action**: Check Supabase console for RLS policy errors

**If you see no logs at all:** 🔴 Page load issue
- **Action**: Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

## Key Updates Made

### 1. **Updated `ENABLE_RLS_FIX.sql`**
- ✅ Now explicitly recreates users table policies
- ✅ Added missing INSERT policy for users
- ✅ Added timeout safeguards for edge cases
- ✅ Verification logic to ensure all policies exist

### 2. **Updated `profile/page.tsx`**
- ✅ Added 5-second timeout per API call
- ✅ Enhanced console logging with emojis 🟡 🔴 ✅
- ✅ Detailed error messages showing exact failure point
- ✅ Timestamps for each operation

## Expected Behavior After Fix

✅ Name saves in < 1 second typically
✅ "Saving..." indicator disappears immediately  
✅ Success toast appears
✅ Console shows all green logs with timestamps

## If Problem Persists

1. **Screenshot the console logs** (red error messages)
2. **Check Supabase dashboard** for any error alerts
3. **Verify RLS status** in Supabase:
   - Go to: Authentication → Policies
   - Look for each table's RLS status
   - Should see 🟢 "Enabled" not 🔴 "Disabled"

## Database Context

The update path is:
```
Browser → Supabase Auth API → Auth metadata
          ↓
          Supabase DB API → users table (RLS policy checks)
```

Both must complete successfully and quickly for the save to work.
