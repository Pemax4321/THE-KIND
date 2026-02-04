# THE KIND - Database & Backend Setup Checklist

## ✅ Completed Steps

- [x] Supabase project created and configured
- [x] Environment variables set in `.env.local`
- [x] Authentication context implemented (Supabase Auth)
- [x] Database schema created with all tables
- [x] Row-level security (RLS) policies configured
- [x] 40 system kindness acts seeded
- [x] Complete data access layer implemented

## 🔧 NEXT STEPS - Execute the SQL Schema

### Step 1: Open Supabase Console
1. Go to https://supabase.com
2. Sign in to your account
3. Select your project: "pgutgpngpmkajswtwupr"

### Step 2: Execute the SQL Schema
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `SUPABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click **Run** button
6. Wait for success message ✅

### Step 3: Verify Tables Created
1. Click **Database** → **Tables** in the sidebar
2. You should see:
   - ✅ `users`
   - ✅ `kindness_acts` (with 40 seeded acts)
   - ✅ `custom_kindness_ideas`
   - ✅ `reflections`
   - ✅ `moods`

### Step 4: Verify Policies
1. Click on `kindness_acts` table
2. Go to the **RLS** tab
3. You should see policies for SELECT, INSERT, UPDATE, DELETE

### Step 5: Test Authentication
In your app:
1. Try to register a new account
2. Check Supabase Console → **Auth** → **Users**
3. Your user should appear in the list

## 📊 Database Tables Overview

### users
- id (UUID) - Primary key, linked to auth.users
- email (TEXT)
- display_name (TEXT)
- avatar_url (TEXT)
- created_at, updated_at

### kindness_acts
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to users
- description (TEXT)
- category (TEXT) - Connection, Daily Life, Digital, Academic, Community
- is_system (BOOLEAN) - TRUE for system, FALSE for user-created
- completed (BOOLEAN)
- completed_at (TIMESTAMP)
- created_at, updated_at

**40 System Acts Seeded**: 8 per category (Connection, Daily Life, Digital, Academic, Community)

### custom_kindness_ideas
- id (UUID)
- user_id (UUID) - Foreign key (user can only see own ideas)
- description (TEXT)
- category (TEXT)
- created_at, updated_at

### reflections
- id (UUID)
- user_id (UUID)
- act_id (UUID) - Optional reference to kindness act
- title (TEXT)
- content (TEXT) - Reflection text
- mood (TEXT) - Enum: happy, sad, calm, anxious, grateful, loved, neutral, frustrated
- created_at, updated_at

### moods
- id (UUID)
- user_id (UUID)
- mood (TEXT) - Same enum as reflections
- note (TEXT) - Optional context
- created_at

## 🔐 Row-Level Security (RLS) Policies

All tables have RLS enabled with these policies:

### kindness_acts
- **SELECT**: System acts visible to all, user acts only to owner
- **INSERT**: Users can create their own acts
- **UPDATE**: Users can update their own acts
- **DELETE**: Users can delete their own acts

### custom_kindness_ideas
- **SELECT**: Users can only see their own ideas
- **INSERT**: Users can create ideas
- **UPDATE**: Users can update their own ideas
- **DELETE**: Users can delete their own ideas

### reflections
- **SELECT**: Users can only see their own reflections
- **INSERT**: Users can create reflections
- **UPDATE**: Users can update their own reflections
- **DELETE**: Users can delete their own reflections

### moods
- **SELECT**: Users can only see their own moods
- **INSERT**: Users can create mood entries
- **DELETE**: Users can delete their own moods

## 🚀 Testing the Setup

### Test 1: Register a New User
```bash
npm run dev
# Visit http://localhost:3000
# Click Register
# Enter email: test@example.com
# Enter password: TestPassword123!
# Click Register
```

### Test 2: Check User Created
1. Go to Supabase Console
2. Click **Database** → **Tables** → **users**
3. Click **Table Editor**
4. You should see your new user with their email

### Test 3: Verify RLS Protection
1. Stay logged in as User A
2. Open another browser/incognito window
3. Register as User B
4. In Supabase console, check `custom_kindness_ideas` table
5. Each user should only see their own ideas (RLS prevents cross-access)

### Test 4: Test Database Operations
1. In the app, complete a kindness act
2. Check Supabase: `kindness_acts` table
3. Entry should have:
   - user_id = your user's ID
   - completed = true
   - completed_at = timestamp

## 📚 Data Access Layer (lib/data.ts)

All these functions are now available:

### System Kindness Acts
```typescript
getAllSystemKindnessActs() // Get all 40 system acts
getRandomKindnessIdea() // Random from local list
```

### Custom Ideas
```typescript
addCustomKindnessIdea(userId, description, category)
getCustomKindnessIdeas(userId)
updateCustomKindnessIdea(ideaId, description, category)
deleteCustomKindnessIdea(ideaId)
```

### Kindness Tracking
```typescript
addKindnessAct(userId, description, category)
completeKindnessAct(actId)
deleteKindnessAct(actId)
getKindnessActs(userId)
getCompletedKindnessActs(userId)
```

### Mood Tracking
```typescript
addMoodEntry(userId, mood, note)
getMoodEntries(userId, days)
getDailyMoodEntries(userId)
```

### Reflections
```typescript
addJournalEntry(userId, content, mood, actId, title)
updateJournalEntry(entryId, content, mood, title)
deleteJournalEntry(entryId)
getJournalEntries(userId)
```

### Analytics
```typescript
getUserStats(userId) // Total acts, streaks, moods, etc.
getMoodTrend(userId, days) // Daily mood trends
```

## 🎯 What's Next

After executing the SQL schema:

1. **Fix the infinite recursion error** (already done!)
2. **Build authentication UI** (already implemented)
3. **Create dashboard page** - Display welcome, generator, stats
4. **Build kindness generator** - Random acts, completion
5. **Add reflection journal** - Post-act reflections
6. **Create analytics** - Charts and statistics
7. **Add custom ideas** - CRUD interface
8. **Integrate quotes API**
9. **Add music suggestions**
10. **Test and optimize**

## ⚠️ Important Notes

- All data is automatically secured by RLS policies
- Each user can ONLY access their own data
- System acts are visible to all users
- Timestamps are automatically managed
- Indexes are created for optimal performance

## 🐛 If Something Goes Wrong

### "Table already exists"
- You may have already run the schema
- It's safe to re-run (uses `IF NOT EXISTS`)

### "Permission denied" error
- Check that you're logged in to Supabase
- Verify your project URL and ANON key in `.env.local`

### "No data showing up"
- Check RLS is properly configured
- Verify you're querying with the correct user_id
- Check Supabase logs for errors

## 📞 Support Commands

```bash
# View Supabase logs
supabase logs start

# Check table structure
supabase db list

# Access Supabase directly
psql "postgresql://..."
```

---

**Status**: 🟢 Ready for schema execution
**Next Action**: Execute SUPABASE_SCHEMA.sql in Supabase console
