# Fix for Supabase SQL Error: "functions must be marked IMMUTABLE"

## Problem
You're getting this error:
```
ERROR: 42P17: functions in index expression must be marked IMMUTABLE
```

This happens because a previous query created trigger functions that conflict with the new schema.

---

## Solution (3 Steps)

### Step 1: Clean Up Old Objects
1. Go to **Supabase Console → SQL Editor**
2. Create **NEW query**
3. Copy entire contents of **CLEANUP_SCHEMA.sql**
4. Click **Run**
5. Wait for success

### Step 2: Use Fixed Schema
1. Create **NEW query** (in same SQL Editor)
2. Copy entire contents of **SUPABASE_SCHEMA_FIXED.sql** (this file replaces SUPABASE_SCHEMA.sql)
3. Click **Run**
4. Wait for success message

### Step 3: Verify
1. Click **Database** → **Tables**
2. You should see:
   - ✅ users
   - ✅ kindness_acts (with 40 acts)
   - ✅ custom_kindness_ideas
   - ✅ reflections
   - ✅ moods

---

## What Changed
The fixed schema removes the problematic trigger functions that use `NOW()`. Instead:
- Timestamps are set to `DEFAULT TIMEZONE('utc'::text, NOW())`
- No triggers needed
- No immutability errors
- Same functionality, simpler code

---

## Why This Happened
When you ran a previous query, it created trigger functions. When we tried to create the schema again, it conflicted because:
1. Functions using `NOW()` aren't immutable
2. PostgreSQL was trying to use them in indexes
3. This caused the error

The cleanup script removes these conflicts, and the fixed schema avoids the problem entirely.

---

## If You Still Get Errors

### Error: "Table already exists"
- This is fine, use `IF NOT EXISTS` clauses (already in fixed schema)
- Can safely re-run

### Error: "Cannot drop function..."
- Means something depends on it
- Run cleanup script again with CASCADE
- Or manually drop dependent objects first

### Error: "Permission denied"
- Check you're logged into correct Supabase project
- Verify your role has appropriate permissions
- Try in incognito/private browser

---

## Files to Use

**OLD** (has issues):
- ❌ SUPABASE_SCHEMA.sql

**NEW** (use this):
- ✅ SUPABASE_SCHEMA_FIXED.sql
- ✅ CLEANUP_SCHEMA.sql (run first)

---

## Timeline
- Cleanup: 1-2 minutes
- Fixed schema: 2-3 minutes
- Verify: 1 minute
- **Total: 5 minutes**

---

## Commands to Run (in Order)

```
1. CLEANUP_SCHEMA.sql (run first)
2. SUPABASE_SCHEMA_FIXED.sql (run second)
3. ✅ Done!
```

---

**Status**: Ready to fix
**Time**: 5 minutes
**Risk**: Low (just clearing up conflicts)
