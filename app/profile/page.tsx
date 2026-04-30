"use client"

import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ChangeEvent } from "react"
import { User, LogOut, Mail, Award, Lock, AlertTriangle, Copy, Check, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, signOut, userRole } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const firstName = displayName.split(" ")[0] || "User"
  const userEmail = user.email || ""
  const userId = user.id || ""
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : ""

  // Update display name
  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a name")
      return
    }

    setIsSavingName(true)
    console.log("🔵 [NAME SAVE START] Attempting to save name:", displayName)
    
    try {
      console.log("🟡 [DB UPDATE] Starting database update...")
      const dbStart = Date.now()
      const { error: dbError, data: dbData } = await Promise.race([
        supabase
          .from("users")
          .update({ display_name: displayName })
          .eq("id", user.id),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("DB update timeout after 5s")), 5000)
        )
      ]) as any

      if (dbError) {
        console.error("🔴 [DB ERROR]", dbError)
        throw dbError
      }
      console.log(`✅ [DB SUCCESS] Completed in ${Date.now() - dbStart}ms, rows affected:`, dbData?.length)

      toast.success("Profile updated successfully!")
      setIsEditingName(false)
      console.log("✅ [NAME SAVE COMPLETE]")
    } catch (error: any) {
      console.error("🔴 [SAVE FAILED]", error?.message || error)
      toast.error(`Failed to update profile: ${error?.message || "Unknown error"}`)
    } finally {
      setIsSavingName(false)
      console.log("🟢 [SAVE STATE RESET] isSavingName set to false")
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast.success("Password changed successfully!")
      setNewPassword("")
      setShowPasswordDialog(false)
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    console.log("Logout started")
    setIsLoggingOut(true)
    setShowLogoutDialog(false)
    
    try {
      console.log("Calling signOut...")
      await signOut()
      console.log("SignOut successful")
      
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      console.log("Navigating to login...")
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setShowLogoutDialog(false)
      toast.error("Logout failed. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    console.log("Account deletion started")
    setIsDeletingAccount(true)
    setShowDeleteDialog(false)
    
    try {
      console.log("Deleting user data from database...")
      const { error: deleteUserDataError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id)

      if (deleteUserDataError && !deleteUserDataError.message.includes("does not exist")) {
        throw deleteUserDataError
      }

      console.log("Signing out...")
      await signOut()

      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Account deletion complete, navigating...")
      toast.success("Account deleted successfully")
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      setShowDeleteDialog(false)
      toast.error("Failed to delete account. Please try again.")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // Copy user ID
  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            {/* Avatar & Name Card */}
            <Card className="border-border/50 shadow-lg animate-slide-in hover-lift">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 flex items-center justify-center transition-smooth hover:scale-105">
                    <User className="w-12 h-12 text-primary transition-smooth" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{firstName}</h2>
                    <p className="text-sm text-muted-foreground capitalize transition-smooth">{userRole || "User"} Role</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                    className="w-full hover-glow"
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 animate-slide-in hover-lift" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 transition-smooth" />
                  Account Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Member Since</p>
                  <p className="text-sm font-medium">{joinDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Account Status</p>
                  <p className="text-sm font-medium text-green-600">✓ Active</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-border/50 shadow-lg animate-slide-in hover-lift" style={{ animationDelay: '0.15s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 transition-smooth" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditingName ? (
                  <div className="space-y-3 animate-scale-in">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Full Name</label>
                      <Input
                        value={displayName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-input border-border transition-smooth"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        First name will be used as greeting in the app
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleUpdateName}
                        disabled={isSavingName}
                        className="flex-1 hover-glow"
                      >
                        {isSavingName ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false)
                          setDisplayName(user.user_metadata?.display_name || "")
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-foreground">{displayName || "Not set"}</p>
                  </div>
                )}

                {/* Role */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <div className="flex items-center gap-2">
                    <span className="capitalize px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {userRole || "General User"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="border-border/50 animate-slide-in hover-lift" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 transition-smooth" />
                  Account Details
                </CardTitle>
                <CardDescription>Your email and account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="transition-smooth">
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded bg-muted text-sm font-mono text-foreground transition-smooth hover:bg-muted/80">
                      {userEmail}
                    </code>
                    <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                  </div>
                </div>

                <div className="transition-smooth">
                  <p className="text-sm text-muted-foreground mb-1">User ID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded bg-muted text-xs font-mono text-foreground truncate transition-smooth hover:bg-muted/80">
                      {userId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyUserId}
                      className="shrink-0 hover-glow"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600 animate-scale-in" />
                      ) : (
                        <Copy className="w-4 h-4 transition-smooth hover:scale-110" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-border/50 animate-slide-in hover-lift" style={{ animationDelay: '0.25s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 transition-smooth" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start hover-glow"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <Lock className="w-4 h-4 mr-2 transition-smooth" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-destructive/5 animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 transition-smooth animate-pulse-glow" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive hover-glow"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="w-4 h-4 mr-2 transition-smooth" />
                  Logout
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start hover-glow"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2 transition-smooth" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Password Change Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={(open: boolean) => {
        if (!isChangingPassword) {
          setShowPasswordDialog(open)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your new password (minimum 6 characters)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              disabled={isChangingPassword}
              className="bg-input border-border"
            />
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={isChangingPassword}>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                console.log("Change password button clicked")
                handleChangePassword()
              }}
              disabled={isChangingPassword}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={(open: boolean) => {
        if (!isLoggingOut) {
          setShowLogoutDialog(open)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to log back in to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                console.log("Logout button clicked")
                handleLogout()
              }}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open: boolean) => {
        if (!isDeletingAccount) {
          setShowDeleteDialog(open)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                console.log("Delete account button clicked")
                handleDeleteAccount()
              }}
              disabled={isDeletingAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
