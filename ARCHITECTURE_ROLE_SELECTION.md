 # ARCHITECTURE OVERVIEW: Role Selection Feature

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        THE KIND APP                         │
│              Pre-Login Onboarding + Role Selection          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     PUBLIC ROUTES (No Auth)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  /start ──────────────────► Role Selection (/select-role)  │
│   └─ Welcome Landing          │                             │
│      - "Get Started"           ├─► Signup (/signup)        │
│      - "Log In"                │                             │
│                                └─► Login (/login)          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION (Supabase)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Signup Flow:                 Login Flow:                   │
│  1. auth.signUp()             1. auth.signIn()             │
│  2. users.insert({role})      2. fetchUserRole()           │
│  3. localStorage.clear()      3. setUserRole()             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   PROTECTED ROUTES (Auth + Role)            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  / (Dashboard)                                              │
│  ├─► KindnessGenerator (Role-Based Ideas)                  │
│  ├─► Dashboard                                              │
│  ├─► Profile                                                │
│  └─► Journal                                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Signup Data Flow
```
Role Selection Page
        ↓
Store in localStorage: {selectedRole}
        ↓
Signup Page
        ↓
User Form Submission
        ↓
auth.signUp() [Supabase Auth]
        ↓
signUp() in auth-context
        ├─→ users.insert({
        │     id: auth_user_id,
        │     email,
        │     display_name,
        │     role: localStorage.selectedRole
        │   })
        │
        └─→ localStorage.removeItem("selectedRole")
        ↓
Redirect to Dashboard
        ↓
Dashboard fetches user role and shows personalized ideas
```

### Login Data Flow
```
Login Page
        ↓
Email & Password Submission
        ↓
auth.signIn() [Supabase Auth]
        ↓
signIn() + fetchUserRole() in auth-context
        ├─→ users.select({role})
        │     .where(id = auth_user_id)
        │
        └─→ setUserRole(fetched_role)
        ↓
Redirect to Dashboard
        ↓
Dashboard shows role-specific kindness ideas
```

---

## Component Hierarchy

```
RootLayout
  └─ AuthProvider (auth-context)
      │
      ├─ page.tsx (/)
      │  ├─ Redirect to /start if not authenticated
      │  └─ Dashboard if authenticated with role
      │
      ├─ start/page.tsx
      │  └─ Start Page
      │
      ├─ select-role/page.tsx
      │  └─ Role Selection
      │
      ├─ signup/page.tsx
      │  └─ Signup Form
      │
      ├─ login/page.tsx
      │  └─ Login Form
      │
      └─ Dashboard
         ├─ KindnessGenerator (uses useAuth hook)
         ├─ JournalComponent
         ├─ MoodTracker
         └─ StatsOverview
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'general',              ← NEW
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_user_role               ← NEW
    CHECK (role IN ('student', 'lecturer', 'general'))
);

CREATE INDEX idx_users_role ON users(role);  ← NEW
```

### Role Values
| Role | Use Case | Kindness Ideas |
|------|----------|---|
| `'student'` | Students, Academics | 25 (19 general + 10 academic) |
| `'lecturer'` | Teachers, Mentors | 30 (19 general + 11 teaching) |
| `'general'` | Everyone else | 19 (community, daily life) |

---

## State Management

### AuthContext State
```typescript
interface AuthContextType {
  user: User | null              // Supabase auth user
  loading: boolean               // Loading state
  userRole: string | null        // NEW: User's role
  
  signIn: (email, password) => Promise<void>
  signUp: (email, password, displayName?, role?) => Promise<void>
  signOut: () => Promise<void>
  fetchUserRole: (userId) => Promise<string | null>  // NEW
}
```

### LocalStorage
```javascript
// During role selection → signup flow:
localStorage.setItem("selectedRole", "student|lecturer|general")

// After successful signup:
localStorage.removeItem("selectedRole")
```

---

## Role-Based Ideas System

### Kindness Ideas Structure
```typescript
interface DefaultKindnessIdea {
  description: string
  category: string
  roles?: string[]  // Optional role restriction
}

// Arrays:
DEFAULT_KINDNESS_IDEAS      // 19 general ideas
STUDENT_KINDNESS_IDEAS      // 25 total (19 + 6 academic-specific)
LECTURER_KINDNESS_IDEAS     // 30 total (19 + 11 teaching-specific)

// Functions:
getKindnessIdeasByRole(role: string) 
  → Returns appropriate idea array

getRandomKindnessIdeaByRole(role: string)
  → Returns random idea from role-specific array
```

### Integration with KindnessGenerator
```
useAuth() → userRole
    ↓
getRandomKindnessIdeaWithCustom(customIdeas, userRole)
    ↓
getKindnessIdeasByRole(userRole)
    ↓
Combine with custom ideas
    ↓
Return random selection
    ↓
Display in UI
```

---

## Authentication Flow Diagram

```
                    ┌─────────────────┐
                    │   User Visits   │
                    │  App / (home)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Logged In?     │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
            NO  YES                      │
              │   │                      │
              │   │ Has Role?            │
              │   └────────┬─────────┐   │
              │            │         │   │
              │          YES         NO  │
              │            │         │   │
              ▼            ▼         ▼   ▼
            /start      /dashboard  /select-role
              │
         ┌────┴────┐
         │          │
    Get Started  Log In
         │          │
         ▼          ▼
    /select-role  /login
         │          │
         ▼          ▼
      /signup   auth + fetch role
         │          │
    auth + save   Redirect
      role to DB    │
         │          ▼
         └─────→ /dashboard
```

---

## Key Functions & Imports

### From `auth-context.tsx`
```typescript
useAuth() → {
  user: User | null
  loading: boolean
  userRole: string | null
  signIn(email, password): Promise<void>
  signUp(email, password, displayName?, role?): Promise<void>
  signOut(): Promise<void>
  fetchUserRole(userId): Promise<string | null>
}
```

### From `kindness-ideas.ts`
```typescript
getKindnessIdeasByRole(role): DefaultKindnessIdea[]
getRandomKindnessIdeaByRole(role): DefaultKindnessIdea
getKindnessIdeasByRole(role): DefaultKindnessIdea[]

// Constants
DEFAULT_KINDNESS_IDEAS      // General ideas
STUDENT_KINDNESS_IDEAS      // Academic ideas
LECTURER_KINDNESS_IDEAS     // Teaching ideas
```

### From `data.ts`
```typescript
getRandomKindnessIdeaWithCustom(
  customIdeas: CustomKindnessIdea[],
  userRole?: string | null
): DefaultKindnessIdea
```

---

## File Dependencies

```
app/page.tsx
  ├─ useAuth (lib/auth-context.tsx)
  ├─ useRouter (next/navigation)
  └─ Dashboard (components/dashboard.tsx)

app/start/page.tsx
  ├─ useRouter (next/navigation)
  ├─ Button (components/ui/button.tsx)
  └─ Heart (lucide-react)

app/select-role/page.tsx
  ├─ useRouter (next/navigation)
  ├─ useState, useEffect (react)
  ├─ Card (components/ui/card.tsx)
  ├─ Button (components/ui/button.tsx)
  ├─ Badge (components/ui/badge.tsx)
  └─ lucide-react icons

app/signup/page.tsx
  ├─ useRouter (next/navigation)
  ├─ useAuth (lib/auth-context.tsx)
  ├─ Button (components/ui/button.tsx)
  ├─ Input (components/ui/input.tsx)
  ├─ Card (components/ui/card.tsx)
  ├─ toast (sonner)
  └─ Heart, ArrowLeft (lucide-react)

app/login/page.tsx
  ├─ useRouter (next/navigation)
  ├─ useAuth (lib/auth-context.tsx)
  ├─ Button (components/ui/button.tsx)
  ├─ Input (components/ui/input.tsx)
  ├─ Card (components/ui/card.tsx)
  ├─ toast (sonner)
  └─ Heart, Loader2 (lucide-react)

lib/auth-context.tsx
  ├─ supabase (lib/supabase.ts)
  └─ @supabase/supabase-js

lib/kindness-ideas.ts
  (No external dependencies)

lib/data.ts
  ├─ supabase (lib/supabase.ts)
  ├─ getKindnessIdeasByRole (lib/kindness-ideas.ts)
  ├─ getDailyQuote (lib/quotes.ts)
  ├─ getMusicForMood (lib/music-config.ts)
  └─ APP_CONFIG (lib/config.ts)

components/kindness-generator.tsx
  ├─ useAuth (lib/auth-context.tsx)
  ├─ getRandomKindnessIdeaWithCustom (lib/data.ts)
  ├─ addKindnessAct (lib/data.ts)
  ├─ getCategoryColor (lib/categories.ts)
  ├─ getKindnessIdeasByRole (lib/kindness-ideas.ts)
  ├─ Button, Card, Badge (components/ui/)
  ├─ toast (sonner)
  └─ lucide-react icons
```

---

## Environment & Dependencies

### No New Dependencies Required!
All existing npm packages are used:
- `@supabase/supabase-js` - Already used
- `next` - Already used
- `react` - Already used
- `lucide-react` - Already used for icons
- `sonner` - Already used for toast notifications
- UI components (shadcn/ui) - Already in use

### Environment Variables (No Changes)
- `NEXT_PUBLIC_SUPABASE_URL` - Already configured
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Already configured

---

## Performance Considerations

### Database
- ✅ Index on `users.role` for fast lookups
- ✅ Role stored as TEXT (simple, indexed)
- ✅ Constraints prevent invalid values

### Frontend
- ✅ Role fetched once during login/session start
- ✅ Kindness ideas pre-computed (no DB queries for ideas)
- ✅ localStorage used only during signup (cleared after)
- ✅ No extra API calls added

### Optimization
- Ideas are static arrays (not fetched from DB)
- Role is cached in component state
- Lazy evaluation of random ideas
- Early redirects prevent unnecessary renders

---

**Architecture is production-ready and scalable!** ✅

