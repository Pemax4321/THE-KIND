# Profile Feature - Quick Start Guide

## ⚡ Setup (3 Steps)

### Step 1: Add Avatar Column to Database
**Run this SQL in Supabase Console:**

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_config TEXT;
```

### Step 2: Restart App
```bash
# The app is already running at http://localhost:3000
# Just refresh the page in your browser
```

### Step 3: Access Profile
1. Click user avatar in **top-right corner**
2. Click **"Profile"** in dropdown menu
3. You're on the profile page! 🎉

---

## 📖 How to Use

### Customize Avatar
1. Click **"Customize Avatar"** button
2. Select your preferences:
   - Skin tone
   - Hair style
   - Hair color
   - Eye shape
   - Eye color
   - Expression/mood
3. See **real-time preview** as you select
4. Click **"Save Avatar"**

### Edit Name
1. Click **"Edit Name"** button
2. Enter your name (max 50 characters)
3. Click **"Save Changes"**
4. Name updates everywhere in the app!

---

## 🎨 Avatar Options (30 Combinations!)

**Skin Tones:** Light, Medium Light, Medium, Medium Dark, Dark

**Hair:** Short, Long, Curly, Straight, Wavy, Pixie, Bob

**Hair Colors:** Black, Brown, Blonde, Red, Auburn, Gray, Purple

**Eyes:** Round, Almond, Hooded, Upturned, Downturned

**Eye Colors:** Brown, Blue, Green, Hazel, Gray

**Expressions:** 😊 😐 😢 😮 😠 😍

---

## 📁 Files & Features

| File | Purpose |
|------|---------|
| `lib/avatar-config.ts` | Avatar options and config |
| `components/avatar-display.tsx` | Avatar SVG renderer |
| `components/avatar-customizer.tsx` | Customization UI |
| `components/name-editor.tsx` | Name editing form |
| `app/profile/page.tsx` | Profile page |
| `ADD_AVATAR_COLUMN.sql` | Database migration |

---

## ✨ Features

✅ Customizable Bitmoji-style avatar (30+ combinations)
✅ Real-time preview
✅ Save to database
✅ Edit display name
✅ Persistent across login/logout
✅ Mobile responsive
✅ Input validation
✅ Success/error notifications
✅ Reset to default option
✅ Profile info display

---

## 🔍 Verification

**Check if everything works:**

1. Create a new account or log in
2. Go to Profile page
3. Customize avatar and save
4. Log out
5. Log back in
6. Avatar should still be there! ✅

7. Change name and save
8. Log out
9. Log back in
10. Name should still be there! ✅

---

## 🐛 Common Issues

**Avatar not saving?**
- Make sure you ran the SQL to add `avatar_config` column
- Check browser console for errors (F12)

**Page not loading?**
- Make sure you're logged in
- Clear browser cache (Cmd+Shift+Delete)

**Name validation errors?**
- Name must be 1-50 characters
- Only letters, spaces, hyphens, apostrophes allowed

---

## 📱 Works On

✅ Desktop
✅ Tablet
✅ Mobile
✅ Dark mode
✅ Light mode

---

## 🎯 What's Next?

See `PROFILE_FEATURE_GUIDE.md` for:
- Full technical documentation
- API reference
- Data storage format
- Enhancement ideas

---

**Status:** Ready to use! 🚀
