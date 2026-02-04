# Quick Start Guide - Configuration

This guide will help you get the Kindness Generator app up and running with all the new configuration system.

## Step 1: Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from:
1. Firebase Console → Your Project → Project Settings
2. Copy the config from "Your web app" section

## Step 2: Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database → Rules tab
4. Replace with rules from `firestore.rules` file
5. Click Publish

## Step 3: Run the App

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000`

---

## Configuration Files Reference

### 📋 `lib/config.ts`
Main application configuration with:
- App name
- Message templates
- Data limits
- Collection names

### 🏷️ `lib/categories.ts`
Kindness categories and their colors:
- Connection, Daily Life, Digital, Academic, Community
- Use `getCategoryColor(category)` in components

### 💡 `lib/kindness-ideas.ts`
Default kindness ideas (25 pre-loaded)
- Organized by category
- Add more ideas here

### 📖 `lib/quotes.ts`
Daily inspiration quotes (15 pre-loaded)
- One quote shown per day
- Add more to rotate through

### 🎵 `lib/music-config.ts`
Music suggestions by mood
- 8 moods with 5 songs each
- Edit to add/remove songs

### 📝 `lib/journal-prompts.ts`
Journal reflection prompts (10 pre-loaded)
- Shown randomly when user opens journal
- Add more for variety

---

## Customizing the App

### Add a New Kindness Idea
Edit `lib/kindness-ideas.ts`:
```typescript
export const DEFAULT_KINDNESS_IDEAS = [
  // ... existing ideas
  { 
    description: "Your new idea here", 
    category: "Connection" 
  },
]
```

### Add a New Quote
Edit `lib/quotes.ts`:
```typescript
export const DAILY_QUOTES = [
  // ... existing quotes
  { 
    quote: "Your inspirational quote", 
    author: "Author Name" 
  },
]
```

### Add Music for a Mood
Edit `lib/music-config.ts`:
```typescript
export const MUSIC_SUGGESTIONS = {
  // ... other moods
  happy: [
    // ... existing songs
    { 
      title: "Song Name", 
      artist: "Artist Name", 
      genre: "Genre" 
    },
  ],
}
```

### Add a Journal Prompt
Edit `lib/journal-prompts.ts`:
```typescript
export const JOURNAL_PROMPTS = [
  // ... existing prompts
  "Your new reflection prompt?",
]
```

### Change App Name
Edit `.env.local`:
```env
NEXT_PUBLIC_APP_NAME=Your App Name
```

Or edit `lib/config.ts`:
```typescript
appName: "Your App Name",
```

---

## Troubleshooting

### "Firebase Setup Required" Error
This means Firestore security rules aren't configured properly:
1. Open the app in browser
2. Click the Firebase Console link
3. Follow the setup instructions
4. Copy rules from `firestore.rules` file

### Environment Variables Not Loading
- Ensure `.env.local` exists in project root
- Restart dev server: `npm run dev`
- Variables must start with `NEXT_PUBLIC_` to be accessible

### Collections Not Found
- Check `.env.local` has correct collection names
- Verify Firestore database exists in Firebase
- Check security rules allow your user access

### Categories Not Showing Colors
- Verify `lib/categories.ts` imports correctly
- Check that color classes exist in Tailwind config
- Ensure components import from `lib/categories`

---

## Future Enhancements

### Phase 2: Admin Panel
- Interface to manage ideas, quotes, music, prompts
- Add/edit/delete without code changes

### Phase 3: Dynamic Loading
- Load content from Firestore instead of hardcoded
- Allow admins to publish content live

### Phase 4: User Personalization
- Users customize their own app colors/name
- Custom categories per user

### Phase 5: Mobile App
- React Native version using same configs
- Share configuration between web and mobile

---

## File Organization

```
lib/
├── config.ts              # Main settings (✓ Updated)
├── categories.ts          # Categories config (✓ New)
├── kindness-ideas.ts      # Ideas config (✓ New)
├── quotes.ts              # Quotes config (✓ New)
├── journal-prompts.ts     # Prompts config (✓ New)
├── music-config.ts        # Music config (✓ Updated)
├── data.ts                # Firestore ops (✓ Updated)
├── firebase.ts            # Firebase init
├── auth-context.tsx       # Auth logic
└── utils.ts               # Utilities

.env.example               # Template (✓ Created)
.env.local                 # Your secrets (✓ Create this)
firestore.rules            # DB Rules (✓ Created)
```

---

## Need Help?

- Check `REFACTORING_SUMMARY.md` for detailed changes
- Review component files for implementation examples
- Firebase docs: https://firebase.google.com/docs/firestore
- Next.js env docs: https://nextjs.org/docs/basic-features/environment-variables

