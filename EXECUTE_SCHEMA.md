# 🗄️ Execute Database Schema - Step-by-Step Visual Guide

## ⚠️ CRITICAL: This MUST be done before using the app!

The SQL schema creates all database tables, security policies, and seeds 40 kindness acts.

---

## Step 1: Open Supabase Console

1. Go to **https://supabase.com**
2. **Sign in** with your account
3. Click on your **project** (pgutgpngpmkajswtwupr)

**You should see**:
```
Project Status: Active ✅
Version: Latest
Region: Your region
```

---

## Step 2: Navigate to SQL Editor

In the left sidebar:
1. Click **SQL Editor** (it looks like `</>`)
2. Click **New Query** button (top right)

**Expected view**:
```
┌─────────────────────────────────────┐
│  SQL Editor                         │
│  New Query  Run  Format  Share      │
├─────────────────────────────────────┤
│                                     │
│  [Empty query window]               │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## Step 3: Copy & Paste SQL Schema

**Option A: Copy from File**

1. Open `SUPABASE_SCHEMA.sql` in your text editor
2. Select ALL content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Paste into Supabase SQL editor (Ctrl+V or Cmd+V)

**Option B: Copy from Project**

In terminal:
```bash
cat /Users/senna/Desktop/Final\ Year/FYP/kindness-generator-app/SUPABASE_SCHEMA.sql | pbcopy
```

Then paste in Supabase SQL editor.

**The SQL includes**:
- ✅ Create all 5 tables
- ✅ Add 40 kindness acts
- ✅ Set up RLS policies
- ✅ Create indexes
- ✅ Add triggers for timestamps

---

## Step 4: Execute the Query

1. Look at the top right of the SQL editor
2. Find the **Run** button (or blue play icon: ▶️)
3. Click **Run**

**You'll see**:
```
⏳ Running query...
```

Then:
```
✅ Query executed successfully
Rows affected: 328
```

**Note**: It says "328 rows" because:
- 40 kindness acts inserted
- Plus other setup operations

---

## Step 5: Verify Tables Created

### Method 1: In Supabase Dashboard

1. Click **Database** in left sidebar
2. Click **Tables**
3. You should see these tables:

```
✅ users
✅ kindness_acts
✅ custom_kindness_ideas
✅ reflections
✅ moods
```

### Method 2: Check Kindness Acts

1. Click on **kindness_acts** table
2. Click **Table Editor** tab
3. You should see 40 rows with acts like:

```
┌──────────────────────────┬──────────────────┐
│ description              │ category         │
├──────────────────────────┼──────────────────┤
│ Send a message to...     │ Connection       │
│ Call a friend or family  │ Connection       │
│ Write a thank you note   │ Connection       │
│ ...                      │ ...              │
└──────────────────────────┴──────────────────┘
```

---

## Step 6: Check RLS Policies

1. Click on **kindness_acts** table
2. Go to the **RLS** tab
3. You should see policies for:

```
✅ SELECT
✅ INSERT
✅ UPDATE
✅ DELETE
```

Each with proper conditions.

---

## Step 7: Test Auth & Database Connection

### In Your App:

```bash
cd /Users/senna/Desktop/Final\ Year/FYP/kindness-generator-app
pnpm dev
```

1. Open http://localhost:3000
2. Click **Register**
3. Enter:
   - Email: test@example.com
   - Password: Test123!@#
   - Display Name: Test User
4. Click **Register**

### Check in Supabase:

1. Go to **Auth** → **Users**
2. You should see your test user:

```
Email: test@example.com
Created: Just now
```

3. Go to **Database** → **users** table
4. Click **Table Editor**
5. You should see user row with your email

---

## ✅ Verification Checklist

After executing SQL schema:

- [ ] Supabase shows "Query executed successfully"
- [ ] All 5 tables appear in Database → Tables
- [ ] kindness_acts table has 40 rows
- [ ] Each table has RLS policies enabled
- [ ] Can register a new user
- [ ] User appears in Auth → Users
- [ ] User appears in users table
- [ ] No console errors in app

---

## ⚠️ If Something Goes Wrong

### "Table already exists"

This is **safe to ignore**. It means:
- You already ran the schema (probably)
- The `IF NOT EXISTS` clause prevents errors
- Your tables are already set up
- Just click Run again

### "Permission denied" error

**Solution**:
1. Check you're logged into correct Supabase project
2. Verify project status is "Active"
3. Check API key permissions are correct
4. Try in incognito/private browser

### "Parse error in SQL"

**Solution**:
1. Make sure you copied the ENTIRE file
2. No truncation happened
3. Try copy-pasting again
4. Check no special characters were corrupted

### "Connection failed"

**Solution**:
1. Check internet connection
2. Verify Supabase project is active
3. Check `.env.local` has correct URL/key
4. Try refreshing the page

---

## 🎯 After Schema Execution

You're ready to:

1. ✅ Register/login users
2. ✅ Start building components
3. ✅ Add kindness acts
4. ✅ Track moods
5. ✅ Save reflections
6. ✅ Build analytics

---

## 📋 Quick Command Reference

```bash
# View SQL file
cat SUPABASE_SCHEMA.sql

# Start dev server (after schema executed)
pnpm dev

# Open project in browser
open http://localhost:3000
```

---

## 🚀 Next Steps After Schema Execution

Once tables are created:

1. Test authentication ✅
2. Build dashboard page
3. Create kindness generator
4. Add mood tracker
5. Build reflection journal
6. Create analytics dashboard

---

## 💾 Backup Note

The database is automatically:
- ✅ Backed up daily by Supabase
- ✅ Encrypted at rest
- ✅ Protected by RLS policies
- ✅ Scalable (PostgreSQL handles millions of rows)

---

## 📞 Need Help?

If schema execution fails:

1. **Check Supabase status**: https://status.supabase.com
2. **Review SQL syntax**: Open SUPABASE_SCHEMA.sql in editor
3. **Check browser console**: Press F12 → Console tab
4. **Review Supabase logs**: Database → Logs → Query performance

---

## ✨ Schema Contents Summary

The SQL file creates:

```sql
-- Tables (5)
CREATE TABLE users ...
CREATE TABLE kindness_acts ...
CREATE TABLE custom_kindness_ideas ...
CREATE TABLE reflections ...
CREATE TABLE moods ...

-- Security (10+ RLS policies)
CREATE POLICY "Users can view..."
CREATE POLICY "Users can only see..."
... etc

-- Indexes (8)
CREATE INDEX idx_kindness_acts_user_id ...
... etc

-- Triggers (3)
CREATE TRIGGER users_update_timestamp ...
... etc

-- Data (40 kindness acts)
INSERT INTO kindness_acts VALUES ...
... x40
```

**Total**: ~1000 lines of SQL

**Execution time**: < 2 seconds

---

**Status**: 🟢 Ready to Execute
**Difficulty**: Easy (just run query)
**Time**: 2-3 minutes
**Critical**: YES ⚠️
