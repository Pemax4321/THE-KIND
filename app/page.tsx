// Home page component - main entry point for the application
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Dashboard } from "@/components/dashboard"
import { Loader2 } from "lucide-react"

// Main export - renders based on authentication state
export default function Home() {
  // Get authentication state, loading status, and user role
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  // Handle redirects when auth state changes
  useEffect(() => {
    try {
      if (!loading) {
        if (!user) {
          // User not logged in - redirect to start
          console.log("No user, redirecting to /start")
          setRedirecting(true)
          router.push("/start")
        } else {
          // User is logged in - show dashboard (role will be fetched/displayed as default if not found)
          console.log("User logged in, showing dashboard. Role:", userRole)
          setRedirecting(false)
        }
      }
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }, [user, loading, router])

  // Display loading spinner while authentication is being checked or redirecting
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading THE KIND...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if user is authenticated (with or without role - will use default role)
  if (user) {
    return <Dashboard />
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading THE KIND...</p>
      </div>
    </div>
  )
}
