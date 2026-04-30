"use client"

import React from "react"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Heart, Loader2, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp, user } = useAuth()

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate that display name is provided
      if (!displayName.trim()) {
        toast.error("Please enter your name")
        setLoading(false)
        return
      }

      // Get role from localStorage (set from select-role page)
      const selectedRole = localStorage.getItem("selectedRole")
      console.log("Signup: selectedRole from localStorage:", selectedRole)

      // Create new account with email, password, display name, and role
      await signUp(email, password, displayName, selectedRole || undefined)
      toast.success("Account created successfully!")
      console.log("Signup successful, redirecting to onboarding")
      
      // Redirect to onboarding guide for new users
      setTimeout(() => {
        console.log("Redirecting to onboarding...")
        router.push("/onboarding")
      }, 1000)
    } catch (error: unknown) {
      // Display error message from auth service
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      console.error("Signup error:", errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* App logo and branding */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">THE KIND</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join us and start spreading kindness today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display name field */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-foreground">
                Your Name
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            {/* Password input field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-input border-border"
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
