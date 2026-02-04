"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"
import { Dashboard } from "@/components/dashboard"
import { Loader2 } from "lucide-react"

// Don't prerender this page since it depends on auth
export const dynamic = 'force-dynamic'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading THE KIND...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <Dashboard />
}
