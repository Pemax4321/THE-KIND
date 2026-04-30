# ROLE SELECTION FEATURE - QUICK START GUIDE

## What's New?

Your app now has a complete pre-login onboarding flow with role selection. Users can select their role (Student, Lecturer, or General User) during signup, and receive personalized kindness suggestions based on their role.

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Apply Database Migration
1. Open your Supabase Dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the contents of `ADD_ROLE_COLUMN.sql`
4. Click **Run**
5. Verify success (no errors)

### Step 2: Test the Flow
1. Navigate to `http://localhost:3000` (or your app URL)
2. You'll see the new **Start Page** with "Small Acts. Real Impact."
3. Click **Get Started**
4. Select your role (Student, Lecturer, or General User)
5. Click **Continue**
6. Sign up with email and password
7. You're redirected to the dashboard with role-specific kindness ideas!

---

## 📱 User-Facing Changes

### Before
- Users went directly to login/signup form at home page

### After
- Users see welcoming start page first
- Select their role before signing up
- Get personalized kindness suggestions based on role

---

## 🛣️ New Routes

| Route | Purpose |
|-------|---------|
| `/start` | Welcome landing page |
| `/select-role` | Role selection (Student/Lecturer/General User) |
| `/signup` | Sign up form (separate from login) |
| `/login` | Sign in form (separate from signup) |
| `/` | Dashboard (redirects to `/start` if not logged in) |

---

## 🧠 How It Works

### Role Storage
- User's role is stored in the Supabase `users` table
- Persists across sessions
- Retrieved on login automatically

### Kindness Ideas
- **Students** get academic-focused ideas (tutoring, sharing notes, study resources)
- **Lecturers** get teaching-focused ideas (encouraging students, mentoring, recognition)
- **General Users** get community-focused ideas (volunteering, helping neighbors)
- Each role's ideas include all general ideas PLUS role-specific suggestions

### Flow
```
Start Page → Role Selection → Signup → Save Role to DB → Dashboard (with role-based ideas)
```

---

## 🔧 Code Changes Summary

### New Files
- `app/start/page.tsx` - Start page
- `app/select-role/page.tsx` - Role selection
- `app/signup/page.tsx` - Signup page
- `app/login/page.tsx` - Login page
- `ADD_ROLE_COLUMN.sql` - Database migration

### Modified Files
- `lib/auth-context.tsx` - Added role handling
- `lib/kindness-ideas.ts` - Added role-based ideas
- `lib/data.ts` - Updated to use role filtering
- `components/kindness-generator.tsx` - Shows role-based ideas
- `app/page.tsx` - Updated main page routing

### Database
- Added `role` column to `users` table
- Added constraint for valid roles
- Added index for performance

---

## 🧪 Testing Checklist

### Sign Up Flow
- [ ] Start page loads with "Small Acts. Real Impact."
- [ ] "Get Started" button works
- [ ] Role selection shows 3 cards
- [ ] Can select and deselect roles
- [ ] "Continue" button only works when role selected
- [ ] Signup form appears after role selection
- [ ] Signup succeeds
- [ ] Redirected to dashboard
- [ ] Kindness ideas match selected role

### Log In Flow
- [ ] "Log in" link on start page works
- [ ] Login form loads
- [ ] Can log in with existing account
- [ ] Redirected to dashboard after login
- [ ] "Don't have an account?" link works

### Role Persistence
- [ ] Log out and log back in
- [ ] Same role is still selected
- [ ] Kindness ideas still match role

### Edge Cases
- [ ] Back button works on signup page
- [ ] localStorage is cleared after signup
- [ ] No role means default ideas shown
- [ ] Mobile responsive design works

---

## 🎨 UI/UX Features

✨ **Start Page**
- Animated heart icon
- Warm, inviting design
- Clear call-to-action

✨ **Role Selection**
- Interactive cards with icons
- Visual feedback on selection
- Clear descriptions for each role

✨ **Signup & Login**
- Split into separate pages for clarity
- Consistent styling
- Back button for navigation

✨ **Kindness Generator**
- Now shows role-appropriate suggestions
- Students see academic ideas
- Teachers see mentoring ideas
- Everyone gets community ideas too

---

## 💡 Tips & Best Practices

### For Users
1. Choose the role that best describes you
2. You can have ideas from all categories, but will see more suggestions for your role
3. You can change kindness ideas by clicking "New Idea"

### For Developers
1. Always call `fetchUserRole()` after user login
2. Use `getKindnessIdeasByRole(userRole)` for role-filtered ideas
3. Test with all three roles to ensure ideas are role-appropriate
4. Check localStorage is cleared after signup

### For QA
1. Test signup → verify role saved in DB
2. Test login → verify role retrieved correctly
3. Test logout/login → verify role persists
4. Test with new user → verify default role is 'general'
5. Cross-browser test (Chrome, Safari, Firefox, mobile)

---

## 🚨 Common Issues & Fixes

### Issue: "Users are not seeing role selection page"
**Fix:** Ensure you ran the database migration and that users table has `role` column

### Issue: "Kindness ideas don't change based on role"
**Fix:** 
1. Check that `userRole` is being fetched from auth context
2. Verify role was saved during signup (check Supabase dashboard)
3. Clear browser cache and localStorage

### Issue: "Login redirects to role selection"
**Fix:** User doesn't have a role in database. This is expected for very old accounts. Redirect them to select a role once.

### Issue: "localStorage not clearing"
**Fix:** Check browser console for errors. The app should clear `selectedRole` after successful signup.

---

## 📚 Documentation Files

- `ROLE_ONBOARDING_IMPLEMENTATION.md` - Complete technical documentation
- `QUICKSTART.md` - General app quickstart
- `SUPABASE_SCHEMA_SIMPLE.sql` - Database schema

---

## 🎉 You're All Set!

The pre-login onboarding with role selection is now live. Your users will have a much better first-time experience with personalized kindness suggestions!

**Next Steps:**
1. Run the database migration
2. Test all flows
3. Deploy to production
4. Monitor user feedback

Questions? Check the implementation documentation or review the code comments.

Happy coding! 💚
