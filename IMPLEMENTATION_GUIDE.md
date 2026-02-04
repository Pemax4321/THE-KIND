# THE KIND - Full Stack Implementation Guide

## Overview
Building a responsive web application promoting mental well-being through random acts of kindness, mood tracking, reflections, and analytics.

## Technology Stack (Updated)
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Hosting**: Vercel (Frontend) + Supabase Cloud (Backend)
- **APIs**: Public Quotes API, Music Recommendation Service

## Phase 1: Database Setup ✅

### Step 1: Execute SQL Schema
1. Go to [Supabase Console](https://supabase.com) → Your Project
2. Navigate to SQL Editor
3. Create new query and paste contents of `SUPABASE_SCHEMA.sql`
4. Execute the query

This creates:
- ✅ All 5 tables with proper relationships
- ✅ Row-level security policies
- ✅ 40 system kindness acts (seeded data)
- ✅ Indexes for performance
- ✅ Audit triggers for timestamps

### Step 2: Configure Environment Variables
```bash
# Already in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://pgutgpngpmkajswtwupr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... # Your anon key
```

## Phase 2: Authentication System

### Features to Implement:
- [ ] User Registration (email + password)
- [ ] User Login with remember-me option
- [ ] Password Reset flow
- [ ] Logout functionality
- [ ] Protected routes (redirect to login if not authenticated)
- [ ] User profile page

### Required Components:
- `auth-form.tsx` - Registration & Login form
- `profile-page.tsx` - User profile management

## Phase 3: Core Features

### 3.1 Kindness Generator
- Display random act from database
- Filter by mood or category
- Mark act as completed
- Suggest next act with smooth animation
- Show act category with color badge
- Store completion history

### 3.2 Reflection Journal
- Post-kindness reflection prompt
- Mood emoji selector (😊 😌 😐 😔 😤 😰 🥰 🤗)
- Short text area for reflection
- Save with timestamp
- Display reflection history (paginated)
- Edit/delete reflections

### 3.3 Mood Tracking
- Log mood whenever user wants
- Emoji-based input
- Optional note/context
- Daily mood history
- Mood trends (weekly, monthly)

### 3.4 Analytics Dashboard
Display:
- Total kindness acts completed
- Current streak (consecutive days with acts)
- Weekly mood chart (line or bar)
- Monthly mood distribution (pie/bar)
- Recent reflections summary
- Engagement stats

### 3.5 Custom Kindness Ideas
- Add new idea (description + category)
- Edit existing ideas
- Delete ideas
- View all custom ideas
- Use custom ideas in generator (mixed with system acts)

### 3.6 Daily Quotes
- Fetch from API daily
- Cache in localStorage (one per day)
- Display on dashboard
- Manual refresh option

### 3.7 Music Suggestions
- Based on mood, suggest:
  - Genre
  - Playlist name
  - Artist recommendations
- No audio playback
- Keep lightweight

## Phase 4: UI/UX Requirements

### Design Principles:
- Warm, uplifting color scheme
- Rounded cards with subtle shadows
- Emoji-based interactions
- Mobile-first responsive design
- Clear navigation
- Loading states for all async operations
- Error messages that are helpful and kind

### Key Pages:
1. **Login/Register** - Clean authentication form
2. **Dashboard** - Daily quote, generator, quick stats
3. **Kindness Acts** - List completed acts with reflections
4. **Mood History** - Track and visualize moods
5. **Analytics** - Charts and statistics
6. **Custom Ideas** - CRUD for user ideas
7. **Profile** - User settings and preferences

## Phase 5: Validation & Error Handling

- Input validation (email format, password strength, text length)
- Clear error messages for all operations
- Graceful API failure handling
- Loading indicators for async operations
- Offline support (localStorage fallback)

## Phase 6: Performance & Security

- RLS policies enforced (users only see their data)
- HTTPS enforced
- Page load time < 3 seconds
- Modular component structure
- Code splitting for faster loads
- Lazy loading for heavy components

## Development Workflow

### Step-by-step build order:
1. ✅ Database schema
2. ✅ Authentication flows
3. Kindness generator core
4. Reflection journal
5. Mood tracking
6. Analytics dashboard
7. Custom ideas
8. Daily quotes
9. Music suggestions
10. Optimize & test

### Running the Dev Server
```bash
cd /Users/senna/Desktop/Final\ Year/FYP/kindness-generator-app
pnpm dev
# Open http://localhost:3000
```

### Testing Checklist
- [ ] All CRUD operations work
- [ ] RLS policies prevent unauthorized access
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling for network failures
- [ ] Loading states visible
- [ ] Performance under 3 seconds

## Important Files

- `SUPABASE_SCHEMA.sql` - Database schema
- `lib/supabase.ts` - Supabase client
- `lib/auth-context.tsx` - Authentication context
- `lib/data.ts` - Database operations (CRUD)
- `lib/config.ts` - App configuration
- `lib/categories.ts` - Category definitions
- `lib/quotes.ts` - Quote service
- `lib/music-config.ts` - Music suggestions
- `lib/kindness-ideas.ts` - Default kindness acts

## API Keys Needed (Optional)

For full functionality:
- Quotes API: https://quotable.io (FREE - no key needed)
- Music API: Spotify Web API or Last.fm (Optional)

## Project Constraints (Must Follow)

❌ NO AI chatbot
❌ NO social features (sharing, messaging, friends)
❌ NO media uploads
❌ NO native mobile app
❌ NO predictive analytics or sentiment analysis

✅ Random acts with mood/time filtering
✅ User reflections and journals
✅ Simple mood tracking
✅ Basic analytics charts
✅ Custom user-created ideas
✅ Daily motivational quotes
✅ Music genre/artist suggestions (no playback)

## Next Steps

1. Execute SUPABASE_SCHEMA.sql in your Supabase console
2. Test database access via Supabase dashboard
3. Begin implementing authentication flows
4. Build core kindness generator feature
5. Add reflection journal
6. Create analytics dashboard
