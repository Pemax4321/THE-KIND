"use client"

import React from "react"

import { useState, type FormEvent } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Heart, Loader2 } from "lucide-react"

// AuthForm component - provides login and registration interface
export function AuthForm() {
  // State management
  const [isLogin, setIsLogin] = useState(true) // Toggle between login and signup modes
  const [email, setEmail] = useState("") // User email input
  const [password, setPassword] = useState("") // User password input
  const [displayName, setDisplayName] = useState("") // User name for signup
  const [loading, setLoading] = useState(false) // Tracks loading state during authentication
  const { signIn, signUp } = useAuth() // Get auth functions from context

  // Handles form submission for both login and signup
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Sign in with email and password
        await signIn(email, password)
        toast.success("Welcome back!")
      } else {
        // Validate that display name is provided before signup
        if (!displayName.trim()) {
          toast.error("Please enter your name")
          setLoading(false)
          return
        }
        // Create new account with email, password, and display name
        await signUp(email, password, displayName)
        toast.success("Account created successfully!")
      }
    } catch (error: unknown) {
      // Display error message from auth service
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2">
          {/* App logo and branding */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">THE KIND</CardTitle>
          {/* Different descriptions for login vs signup */}
          <CardDescription className="text-muted-foreground">
            {isLogin ? "Welcome back! Sign in to continue your kindness journey." : "Join us and start spreading kindness today."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display name field - only shown in signup mode */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-foreground">Your Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            )}
            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
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
              <Label htmlFor="password" className="text-foreground">Password</Label>
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
            {/* Submit button - shows different text based on login/signup mode */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          {/* Toggle between login and signup modes */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
