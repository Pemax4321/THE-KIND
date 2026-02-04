import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

// Only create client if both URL and key are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a dummy client that will fail gracefully at runtime
  // This allows the build to succeed even without env vars
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
      signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ data: null, error: null }) }) }) }),
      insert: () => ({ select: () => ({ data: null, error: null }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
  }
}

export { supabase }
