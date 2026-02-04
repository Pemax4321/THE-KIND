# THE KIND - Random Kindness Generator

## 🎯 Project Overview

**THE KIND** is a responsive web application designed to promote mental well-being by encouraging users to perform daily acts of kindness, reflect on their emotions, and track their progress over time.

**Target Users**: Students and general users (ages 13-65)

**Tech Stack**: Next.js 16 + React 19 + TypeScript + Supabase + Tailwind CSS

**Status**: 🚀 Ready for development

---

## 📋 Core Features

### 1. **Random Kindness Generator** 🎲
- Display random act suggestions from a database of 40+ acts
- Filter by mood, category, or time of day
- Mark completed acts
- Generate new suggestions with smooth animations
- Support both system and user-created acts

### 2. **Reflection Journal** ✍️
- Prompt users to reflect after completing acts
- Emoji-based mood selection
- Save reflections chronologically
- View reflection history
- Edit/delete past reflections

### 3. **Mood Tracking** 😊
- Log mood entries throughout the day
- Emoji-based input (8 mood options)
- Optional context notes
- Daily mood history
- Mood trends visualization

### 4. **Analytics Dashboard** 📊
- Total kindness acts completed
- Current and longest streaks
- Weekly and monthly mood trends
- Mood distribution charts
- Recent reflections summary
- Engagement statistics

### 5. **Custom Kindness Ideas** ✏️
- Users can add their own kindness ideas
- Edit and delete custom ideas
- Organize by category
- Mix with system ideas in generator

### 6. **Daily Quotes & Affirmations** 💭
- Fetch daily motivational quotes
- Cache one quote per day
- Display prominently on dashboard
- Manual refresh option

### 7. **Mood-Based Music Suggestions** 🎵
- Suggest music genres based on mood
- Artist and playlist recommendations
- No audio playback (lightweight feature)
- Optional feature for users

---

## 🏗️ Tech Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js + React)      │
│  - Pages, Components, UI/UX             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    API Layer (lib/data.ts)              │
│  - CRUD operations                      │
│  - Business logic                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     Authentication (Supabase Auth)      │
│  - Register, Login, Logout              │
│  - Session management                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Database (Supabase PostgreSQL)        │
│  - users, kindness_acts, moods, etc.    │
│  - Row-level security policies          │
└─────────────────────────────────────────┘
```

---

## 📦 Database Schema

### Tables

1. **users** - Extended auth user profiles
2. **kindness_acts** - Completed kindness acts with status
3. **custom_kindness_ideas** - User-created act ideas
4. **reflections** - Journal entries with mood
5. **moods** - Mood tracking entries

See `DATABASE_SETUP.md` for complete schema details.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm/pnpm
- Supabase account (free tier is fine)
- Modern web browser

### Installation

```bash
# Clone/navigate to project
cd /Users/senna/Desktop/Final\ Year/FYP/kindness-generator-app

# Install dependencies
pnpm install

# Environment variables
# Already configured in .env.local with:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Development

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000
```

### Database Setup

**IMPORTANT**: You must execute the SQL schema to create tables.

1. Open `SUPABASE_SCHEMA.sql`
2. Go to Supabase Console → SQL Editor
3. Create new query and paste SQL
4. Click Run
5. See `DATABASE_SETUP.md` for detailed instructions

---

## 📁 Project Structure

```
kindness-generator-app/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── auth-form.tsx            # Login/Register form
│   ├── dashboard.tsx            # Main dashboard
│   ├── kindness-generator.tsx   # Random act generator
│   ├── kindness-list.tsx        # List of acts
│   ├── mood-tracker.tsx         # Mood input
│   ├── mood-chart.tsx           # Mood visualization
│   ├── journal.tsx              # Reflection journal
│   ├── stats-overview.tsx       # Stats display
│   ├── custom-kindness-ideas.tsx# User ideas manager
│   ├── daily-quote.tsx          # Quote display
│   ├── music-suggestions.tsx    # Music recommendations
│   ├── header.tsx               # Navigation header
│   └── ui/                      # Radix UI components
│
├── lib/                          # Utilities & data
│   ├── supabase.ts              # Supabase client
│   ├── auth-context.tsx         # Auth context/hooks
│   ├── data.ts                  # Database operations
│   ├── config.ts                # App configuration
│   ├── categories.ts            # Category definitions
│   ├── quotes.ts                # Quote fetching
│   ├── music-config.ts          # Music suggestions
│   ├── kindness-ideas.ts        # Default ideas
│   ├── utils.ts                 # Helper functions
│   └── journal-prompts.ts       # Reflection prompts
│
├── public/                       # Static assets
├── styles/                       # Stylesheets
├── .env.local                   # Environment variables
├── SUPABASE_SCHEMA.sql          # Database schema (RUN THIS!)
├── DATABASE_SETUP.md            # Database setup guide
├── IMPLEMENTATION_GUIDE.md      # Detailed implementation plan
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

---

## 🔐 Security

### Authentication
- ✅ Supabase Auth with email + password
- ✅ Secure session management
- ✅ Password reset capability
- ✅ Protected routes (redirect if not authenticated)

### Data Protection
- ✅ Row-level security (RLS) policies
- ✅ Users can ONLY access their own data
- ✅ System acts visible to all
- ✅ HTTPS enforced
- ✅ CORS properly configured

### Input Validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Text length validation
- ✅ Category validation
- ✅ Mood enum validation

---

## 📊 Key Data Models

### Kindness Act
```typescript
{
  id: string
  userId: string
  description: string
  category: 'Connection' | 'Daily Life' | 'Digital' | 'Academic' | 'Community'
  completed: boolean
  completedAt?: Date
  createdAt: Date
  isSystem: boolean
}
```

### Reflection
```typescript
{
  id: string
  userId: string
  content: string
  mood: 'happy' | 'sad' | 'calm' | 'anxious' | 'grateful' | 'loved' | 'neutral' | 'frustrated'
  actId?: string
  title?: string
  createdAt: Date
}
```

### User Stats
```typescript
{
  totalKindnessActs: number
  completedKindnessActs: number
  currentStreak: number
  longestStreak: number
  moodHistory: { mood: string, count: number }[]
  averageMood?: string
}
```

---

## 🎨 UI/UX Design

### Design Principles
- ✅ Warm, uplifting color palette
- ✅ Rounded cards with subtle shadows
- ✅ Emoji-based interactions
- ✅ Friendly, encouraging tone
- ✅ Mobile-first responsive design
- ✅ Clear visual hierarchy
- ✅ Accessible color contrast

### Pages
1. **Login/Register** - Clean auth form
2. **Dashboard** - Welcome, generator, quick stats
3. **Kindness Acts** - List with reflections
4. **Mood History** - Mood tracking and visualization
5. **Analytics** - Charts and detailed stats
6. **Custom Ideas** - CRUD interface
7. **Profile** - User settings

---

## 📈 Performance Targets

- ✅ Page load time: < 3 seconds
- ✅ Mobile responsive (320px - 1920px)
- ✅ Smooth animations (60fps)
- ✅ Optimized bundle size
- ✅ Code splitting enabled
- ✅ Lazy loading for images/components

---

## 🔄 Development Workflow

### Phase 1: Setup ✅
- [x] Supabase project created
- [x] Environment variables configured
- [x] Authentication implemented
- [x] Database schema designed
- [x] Data access layer created

### Phase 2: Core Features (In Progress)
- [ ] Dashboard page
- [ ] Kindness generator
- [ ] Reflection journal
- [ ] Mood tracking
- [ ] Analytics dashboard

### Phase 3: Enhancement
- [ ] Custom ideas
- [ ] Daily quotes
- [ ] Music suggestions
- [ ] Error handling
- [ ] Validation

### Phase 4: Optimization
- [ ] Performance tuning
- [ ] Mobile optimization
- [ ] Accessibility audit
- [ ] Testing

### Phase 5: Deployment
- [ ] Deploy to Vercel
- [ ] Final testing
- [ ] Documentation

---

## 📚 Useful Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)

### APIs
- Quotes: [Quotable.io](https://quotable.io) - FREE, no key needed
- Music: [Last.fm](https://www.last.fm/api) or [Spotify API]

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Database Connection Error
- Verify `.env.local` has correct Supabase URL and key
- Check Supabase project status
- Ensure SQL schema has been executed

### Authentication Not Working
- Check Supabase Auth is enabled
- Verify email/password are valid
- Check browser console for errors

### RLS Policy Errors
- Ensure you're logged in
- Check `user_id` matches `auth.uid()`
- Verify RLS policies are properly created

---

## 🎯 Project Scope (Constraints)

### ✅ Included
- Random kindness acts with filtering
- User reflections and journals
- Mood tracking and visualization
- Simple analytics and stats
- Custom user-created ideas
- Daily motivational quotes
- Music genre/artist suggestions

### ❌ NOT Included (Out of Scope)
- AI chatbot
- Social features (sharing, messaging, friends)
- Media uploads
- Native mobile app
- Predictive analytics or sentiment analysis
- Real-time collaboration
- Advanced recommendation engine

---

## 📝 License & Attribution

**Final Year Project** - Computer Science Department
**Student**: Senna
**Project**: THE KIND - Random Kindness Generator
**Year**: 2026

---

## 🚀 Quick Start Checklist

- [ ] Run `pnpm install`
- [ ] Execute SQL schema from `SUPABASE_SCHEMA.sql`
- [ ] Test login/registration
- [ ] Start dev server: `pnpm dev`
- [ ] Build kindness generator component
- [ ] Create dashboard page
- [ ] Add mood tracking
- [ ] Build analytics charts
- [ ] Test on mobile
- [ ] Deploy to Vercel

---

## 📞 Support

For issues or questions:
1. Check `DATABASE_SETUP.md` for database issues
2. Check `IMPLEMENTATION_GUIDE.md` for development guidance
3. Review Supabase console for data/auth issues
4. Check browser console for client-side errors

---

**Last Updated**: January 27, 2026
**Status**: 🟢 Ready for Development
