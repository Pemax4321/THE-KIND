"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getKindnessActs,
  getMoodEntries,
  getJournalEntries,
  getUserStats,
  getCustomKindnessIdeas,
  type KindnessAct,
  type MoodEntry,
  type JournalEntry,
  type UserStats,
  type CustomKindnessIdea,
} from "@/lib/data"
import { Header } from "./header"
import { KindnessGenerator } from "./kindness-generator"
import { KindnessList } from "./kindness-list"
import { MoodTracker } from "./mood-tracker"
import { Journal } from "./journal"
import { StatsOverview } from "./stats-overview"
import { MoodChart } from "./mood-chart"
import { DailyQuote } from "./daily-quote"
import { MusicSuggestions } from "./music-suggestions"
import { CustomKindnessIdeas } from "./custom-kindness-ideas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, BookOpen, BarChart3, AlertTriangle } from "lucide-react"

export function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [customIdeas, setCustomIdeas] = useState<CustomKindnessIdea[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState(false)

  // Auto-fetch all data when user logs in
  useEffect(() => {
    if (!user?.id) {
      console.log("No user ID available yet")
      return
    }
    
    console.log("User logged in, fetching data for:", user.id)
    setLoading(true)
    setPermissionError(false)
    
    const fetchData = async () => {
      try {
        console.log("Starting data fetch...")
        const [acts, moods, journals, userStats, customKindness] = await Promise.all([
          getKindnessActs(user.id),
          getMoodEntries(user.id),
          getJournalEntries(user.id),
          getUserStats(user.id),
          getCustomKindnessIdeas(user.id),
        ])
        
        console.log("Data fetched successfully:", {
          acts: acts.length,
          moods: moods.length,
          journals: journals.length,
          customIdeas: customKindness.length,
        })
        
        setKindnessActs(acts)
        setMoodEntries(moods)
        setJournalEntries(journals)
        setStats(userStats)
        setCustomIdeas(customKindness)
        setLoading(false)
      } catch (error: unknown) {
        console.error("Error fetching data - Full error object:", error)
        
        let errorMessage = "Unknown error"
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === "string") {
          errorMessage = error
        } else if (error && typeof error === "object") {
          errorMessage = JSON.stringify(error, null, 2)
        }
        
        console.error("Processed error message:", errorMessage)
        
        if (errorMessage.includes("permission") || errorMessage.includes("Permission")) {
          setPermissionError(true)
        }
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const refreshAll = useCallback(async () => {
    if (!user?.id) return
    try {
      const [acts, moods, journals, userStats, customKindness] = await Promise.all([
        getKindnessActs(user.id),
        getMoodEntries(user.id),
        getJournalEntries(user.id),
        getUserStats(user.id),
        getCustomKindnessIdeas(user.id),
      ])
      setKindnessActs(acts)
      setMoodEntries(moods)
      setJournalEntries(journals)
      setStats(userStats)
      setCustomIdeas(customKindness)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("Error refreshing data:", errorMessage)
    }
  }, [user?.id])

  const refreshKindness = useCallback(async () => {
    if (!user?.id) return
    const [acts, userStats] = await Promise.all([
      getKindnessActs(user.id),
      getUserStats(user.id),
    ])
    setKindnessActs(acts)
    setStats(userStats)
  }, [user?.id])

  const refreshCustomIdeas = useCallback(async () => {
    if (!user?.id) return
    const ideas = await getCustomKindnessIdeas(user.id)
    setCustomIdeas(ideas)
  }, [user?.id])

  const refreshMoods = useCallback(async () => {
    if (!user?.id) return
    const moods = await getMoodEntries(user.id)
    setMoodEntries(moods)
    const userStats = await getUserStats(user.id)
    setStats(userStats)
  }, [user?.id])

  const refreshJournals = useCallback(async () => {
    if (!user?.id) return
    const journals = await getJournalEntries(user.id)
    setJournalEntries(journals)
  }, [user?.id])

  const recentMood = moodEntries.length > 0 ? moodEntries[0] : null

  if (permissionError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <CardTitle>Firebase Setup Required</CardTitle>
              </div>
              <CardDescription>
                Your Firestore database needs security rules to be configured.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please follow these steps to fix this:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Select your project</li>
                <li>
                  Navigate to <strong>Firestore Database</strong> in the left sidebar
                </li>
                <li>
                  Click on the <strong>Rules</strong> tab
                </li>
                <li>Replace the existing rules with:</li>
              </ol>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
              </pre>
              <ol start={6} className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Click <strong>Publish</strong>
                </li>
                <li>Refresh this page</li>
              </ol>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
              Welcome back, {user?.displayName?.split(" ")[0] || "Friend"}!
            </h1>
            <p className="text-muted-foreground">
              Ready to spread some kindness today?
            </p>
          </div>

          {/* Daily Quote */}
          <DailyQuote />

          {/* Stats Overview */}
          <StatsOverview stats={stats} loading={loading} />

          {/* Main Tabs */}
          <Tabs defaultValue="kindness" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="kindness" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Kindness</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kindness" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <KindnessGenerator onActAdded={refreshKindness} customIdeas={customIdeas} />
                <KindnessList
                  acts={kindnessActs}
                  onUpdate={refreshKindness}
                  loading={loading}
                />
              </div>
              <CustomKindnessIdeas
                ideas={customIdeas}
                onUpdate={refreshCustomIdeas}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="journal" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <MoodTracker onMoodLogged={refreshMoods} recentMoods={moodEntries} />
                <Journal
                  entries={journalEntries}
                  onUpdate={refreshJournals}
                  loading={loading}
                />
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <MoodChart moods={moodEntries} loading={loading} />
                <MusicSuggestions recentMood={recentMood} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
