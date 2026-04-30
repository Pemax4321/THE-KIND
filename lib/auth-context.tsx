"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
  fetchUserRole: (userId: string) => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Fetch user role from database
  const fetchUserRole = async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .maybeSingle()

      if (error) {
        // If the role column doesn't exist, that's okay - just use 'general'
        if (error.message.includes("does not exist")) {
          console.warn("Role column not found in users table. Using 'general' role.")
          return "general"
        }
        console.error("Error fetching user role:", error.message)
        return "general" // Default to general role
      }
      
      if (!data) {
        console.warn("No user profile found for ID:", userId)
        return "general"
      }
      
      const role = data.role || "general"
      console.log("User role fetched:", role)
      return role
    } catch (error) {
      console.error("Error fetching user role:", error)
      return "general"
    }
  }

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            try {
              const role = await fetchUserRole(session.user.id)
              if (isMounted) setUserRole(role)
            } catch (error) {
              console.error("Error fetching role:", error)
              if (isMounted) setUserRole("general")
            }
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    // Set a timeout to force load state after 5 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn("Auth loading timeout - forcing load state")
        setLoading(false)
      }
    }, 5000)

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const role = await fetchUserRole(session.user.id)
            if (isMounted) setUserRole(role)
          } catch (error) {
            console.error("Error fetching role on auth change:", error)
            if (isMounted) setUserRole("general")
          }
        } else {
          setUserRole(null)
        }
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, displayName?: string, role?: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    if (authError) throw authError

    // After successful auth signup, insert user profile with role
    if (authData.user) {
      const selectedRole = role || localStorage.getItem("selectedRole") || "general"
      
      const { data: profileData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            display_name: displayName,
            role: selectedRole,
          },
        ])
        .select()

      if (insertError) {
        console.error("Profile insert error details:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        })
        
        // Throw error with helpful message
        const errorMsg = insertError.message || "Failed to save profile"
        throw new Error(`${errorMsg}. Please ensure RLS policies are configured correctly in Supabase.`)
      }

      // Clear localStorage after successful signup
      localStorage.removeItem("selectedRole")
    }
  }

  const signOut = async () => {
    console.log("Auth signOut called")
    try {
      // Clear user data from state immediately
      setUser(null)
      setUserRole(null)
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Supabase signOut error:", error)
        throw error
      }
      
      console.log("Auth signOut successful")
    } catch (error) {
      console.error("SignOut error:", error)
      // Still clear state even if Supabase signOut fails
      setUser(null)
      setUserRole(null)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, userRole, signIn, signUp, signOut, fetchUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
