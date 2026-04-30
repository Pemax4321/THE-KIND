"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import {
  getKindnessActs,
  getMoodEntries,
  getJournalEntries,
  getUserStats,
  getCustomKindnessIdeas,
  calculateUserStatsFromData,
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
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, BarChart3, AlertTriangle, Smile } from "lucide-react"

export function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [kindnessActs, setKindnessActs] = useState<KindnessAct[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [customIdeas, setCustomIdeas] = useState<CustomKindnessIdea[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)
  
  // Track fetch state to prevent concurrent requests
  const fetchStateRef = useRef({ inProgress: false, userId: "", startedAt: 0, retryCount: 0 })
  const FETCH_TIMEOUT_MS = 20000
  const QUERY_TIMEOUT_MS = 12000
  const MAX_RETRIES = 3

  const withRetry = async <T,>(
    label: string,
    fn: () => Promise<T>,
    retryNum: number = 0
  ): Promise<T> => {
    try {
      console.log(`[RETRY] ${label} - Attempt ${retryNum + 1}/${MAX_RETRIES}`)
      return await Promise.race([
        fn(),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new Error(`${label} timed out after ${QUERY_TIMEOUT_MS}ms`)),
            QUERY_TIMEOUT_MS
          )
        ),
      ])
    } catch (error) {
      if (retryNum < MAX_RETRIES - 1) {
        const delayMs = Math.pow(2, retryNum) * 500
        console.warn(`[RETRY] ${label} failed, retrying in ${delayMs}ms...`, error)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        return withRetry(label, fn, retryNum + 1)
      }
      console.error(`[RETRY] ${label} failed after ${MAX_RETRIES} attempts`)
      throw error
    }
  }

  const withTimeout = async <T,>(label: string, promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
      ),
    ])
  }

  // Auto-fetch all data when user logs in
  useEffect(() => {
    if (!user?.id) {
      console.log("❌ No user ID available")
      return
    }
    
    console.log("📍 useEffect triggered for user:", user.id)
    
    // Prevent concurrent fetches for same user (with stale-fetch escape hatch)
    if (fetchStateRef.current.inProgress && fetchStateRef.current.userId === user.id) {
      const elapsed = Date.now() - fetchStateRef.current.startedAt
      if (elapsed < FETCH_TIMEOUT_MS) {
        console.log("⏭️ Fetch already in progress, skipping")
        return
      }
      console.warn("⚠️ Stale fetch detected (>20s), forcing reset")
      fetchStateRef.current.inProgress = false
    }
    
    // Mark as in progress
    fetchStateRef.current = { inProgress: true, userId: user.id, startedAt: Date.now(), retryCount: 0 }
    
    const fetchData = async () => {
      try {
        console.log("🚀 Starting data fetch for user:", user.id)
        const startTime = performance.now()
        
        // Fetch all data individually with error handling and retry
        console.log("📦 Fetching kindness acts...")
        const acts = await withRetry("getKindnessActs", () => getKindnessActs(user.id))
        console.log(`✓ Kindness acts: ${acts.length} items`)
        
        console.log("📦 Fetching mood entries...")
        const moods = await withRetry("getMoodEntries", () => getMoodEntries(user.id, 7))
        console.log(`✓ Mood entries: ${moods.length} items`)
        
        console.log("📦 Fetching custom ideas...")
        const customIdeas = await withRetry("getCustomKindnessIdeas", () => getCustomKindnessIdeas(user.id))
        console.log(`✓ Custom ideas: ${customIdeas.length} items`)
        
        // Calculate stats
        console.log("📦 Calculating stats...")
        const stats = calculateUserStatsFromData(acts, customIdeas, moods)
        console.log("✓ Stats calculated")
        
        // Update state
        setKindnessActs(acts)
        setMoodEntries(moods)
        setCustomIdeas(customIdeas)
        setStats(stats)
        setLoading(false)
        
        const endTime = performance.now()
        console.log(`✅ All data fetched in ${(endTime - startTime).toFixed(2)}ms`)
        
        // Lazy load journals
        console.log("📦 Lazy loading journals...")
        withRetry("getJournalEntries", () => getJournalEntries(user.id))
          .then(journals => {
            console.log(`✓ Journals loaded: ${journals.length} items`)
            setJournalEntries(journals)
          })
          .catch(err => console.warn("⚠️ Failed to load journals after retries:", err))
      } catch (error) {
        console.error("❌ Fetch error after retries:", error)
        setLoading(false)
        
        if (error instanceof Error && error.message.includes("permission")) {
          setPermissionError(true)
        }
      } finally {
        // Mark fetch as complete
        fetchStateRef.current.inProgress = false
        console.log("🏁 Fetch complete, inProgress=false")
      }
    }

    fetchData()
  }, [user?.id])

  const refreshAll = useCallback(async () => {
    if (!user?.id) return
    try {
      console.log("🔄 Refreshing ALL data...")
      const startTime = performance.now()
      
      const acts = await withRetry("getKindnessActs", () => getKindnessActs(user.id))
      const moods = await withRetry("getMoodEntries", () => getMoodEntries(user.id))
      const customIdeas = await withRetry("getCustomKindnessIdeas", () => getCustomKindnessIdeas(user.id))
      const journals = await withRetry("getJournalEntries", () => getJournalEntries(user.id))
      
      const stats = calculateUserStatsFromData(acts, customIdeas, moods)
      
      setKindnessActs(acts)
      setMoodEntries(moods)
      setCustomIdeas(customIdeas)
      setJournalEntries(journals)
      setStats(stats)
      setLoading(false)
      
      const endTime = performance.now()
      console.log(`✅ Refresh ALL complete in ${(endTime - startTime).toFixed(2)}ms`)
    } catch (error) {
      console.error("❌ Error refreshing all:", error instanceof Error ? error.message : String(error))
      setLoading(false)
    }
  }, [user?.id])

  const refreshKindness = useCallback(async () => {
    if (!user?.id) return
    try {
      console.log("🔄 Refreshing KINDNESS...")
      const startTime = performance.now()
      
      const acts = await withRetry("getKindnessActs", () => getKindnessActs(user.id))
      const moods = await withRetry("getMoodEntries", () => getMoodEntries(user.id))
      const customIdeas = await withRetry("getCustomKindnessIdeas", () => getCustomKindnessIdeas(user.id))
      const stats = calculateUserStatsFromData(acts, customIdeas, moods)
      
      setKindnessActs(acts)
      setCustomIdeas(customIdeas)
      setStats(stats)
      
      const endTime = performance.now()
      console.log(`✅ Refresh KINDNESS complete in ${(endTime - startTime).toFixed(2)}ms`)
    } catch (error) {
      console.error("❌ Error refreshing kindness:", error instanceof Error ? error.message : String(error))
    }
  }, [user?.id])

  const refreshCustomIdeas = useCallback(async () => {
    if (!user?.id) return
    try {
      console.log("🔄 Refreshing CUSTOM IDEAS...")
      const startTime = performance.now()
      
      const ideas = await withRetry("getCustomKindnessIdeas", () => getCustomKindnessIdeas(user.id))
      setCustomIdeas(ideas)
      
      const endTime = performance.now()
      console.log(`✅ Refresh CUSTOM IDEAS complete in ${(endTime - startTime).toFixed(2)}ms`)
    } catch (error) {
      console.error("❌ Error refreshing custom ideas:", error instanceof Error ? error.message : String(error))
    }
  }, [user?.id])

  const refreshMoods = useCallback(async () => {
    if (!user?.id) return
    try {
      console.log("🔄 Refreshing MOODS...")
      const startTime = performance.now()
      
      const moods = await withRetry("getMoodEntries", () => getMoodEntries(user.id))
      const acts = await withRetry("getKindnessActs", () => getKindnessActs(user.id))
      const customIdeas = await withRetry("getCustomKindnessIdeas", () => getCustomKindnessIdeas(user.id))
      const stats = calculateUserStatsFromData(acts, customIdeas, moods)
      
      setMoodEntries(moods)
      setStats(stats)
      
      const endTime = performance.now()
      console.log(`✅ Refresh MOODS complete in ${(endTime - startTime).toFixed(2)}ms`)
    } catch (error) {
      console.error("❌ Error refreshing moods:", error instanceof Error ? error.message : String(error))
    }
  }, [user?.id])

  const refreshJournals = useCallback(async () => {
    if (!user?.id) return
    try {
      console.log("🔄 Refreshing JOURNALS...")
      const startTime = performance.now()
      
      const journals = await withRetry("getJournalEntries", () => getJournalEntries(user.id))
      setJournalEntries(journals)
      
      const endTime = performance.now()
      console.log(`✅ Refresh JOURNALS complete in ${(endTime - startTime).toFixed(2)}ms`)
    } catch (error) {
      console.error("❌ Error refreshing journals:", error instanceof Error ? error.message : String(error))
    }
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
      <main className="w-full px-0 sm:px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8 animate-slide-in">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance transition-smooth">
              Welcome Back, {user?.user_metadata?.display_name?.split(" ")[0] || "Friend"}!
            </h1>
            <p className="text-muted-foreground transition-smooth">
              Ready to spread some kindness today?
            </p>
          </div>

          {/* Daily Quote */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <DailyQuote />
          </div>

          {/* Stats Overview */}
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <StatsOverview stats={stats} loading={loading} />
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="kindness" className="w-full animate-slide-in" style={{ animationDelay: '0.3s' }} onValueChange={(tab) => {
            // Tab change triggers automatically
          }}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="kindness" data-tab="kindness" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Acts</span>
              </TabsTrigger>
              <TabsTrigger value="journal" data-tab="journal" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="mood" data-tab="mood" className="gap-2">
                <Smile className="w-4 h-4" />
                <span className="hidden sm:inline">Mood</span>
              </TabsTrigger>
              <TabsTrigger value="insights" data-tab="insights" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* Original Kindness Tab */}
            <TabsContent value="kindness" className="space-y-6 animate-scale-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="animate-slide-in">
                  <KindnessGenerator onActAdded={refreshKindness} customIdeas={customIdeas} />
                </div>
                <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                  <KindnessList
                    acts={kindnessActs}
                    onUpdate={refreshKindness}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <CustomKindnessIdeas
                  ideas={customIdeas}
                  onUpdate={refreshCustomIdeas}
                  loading={loading}
                />
              </div>
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 animate-slide-in hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 transition-smooth" />
                      Your Journal
                    </CardTitle>
                    <CardDescription>Reflect on your kindness journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Journal 
                      entries={journalEntries}
                      onUpdate={refreshJournals}
                      loading={loading}
                    />
                  </CardContent>
                </Card>

                <Card className="animate-slide-in hover-lift" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      Your Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {moodEntries.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">Latest mood:</p>
                          <p className="text-lg font-semibold capitalize">
                            {moodEntries[0]?.mood_type || "Not logged"}
                          </p>
                          {moodEntries[0]?.context && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {moodEntries[0].context}
                            </p>
                          )}
                        </div>
                        <Button 
                          onClick={refreshMoods}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Refresh
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No mood logged yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mood Tab */}
            <TabsContent value="mood" className="space-y-6">
              <Card className="animate-slide-in hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="w-5 h-5 transition-smooth" />
                    How are you feeling?
                  </CardTitle>
                  <CardDescription>Log and track your emotional journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <MoodTracker onMoodLogged={refreshMoods} recentMoods={moodEntries} />
                </CardContent>
              </Card>

              {/* Music Suggestions Based on Latest Mood */}
              {recentMood && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <MusicSuggestions recentMood={recentMood} />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="animate-slide-in hover-lift" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 transition-smooth" />
                      Mood Trends
                    </CardTitle>
                    <CardDescription>Your emotional journey over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MoodChart moods={moodEntries} loading={loading} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              {/* Quick Stats Section */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Total Acts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats?.totalActs || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">kindness acts completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{stats?.streak || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">days in a row</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Longest Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">{stats?.longestStreak || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">days achieved</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Journal Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{journalEntries.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">reflections recorded</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Mood Distribution
                    </CardTitle>
                    <CardDescription>Your emotional patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MoodChart moods={moodEntries} loading={loading} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emotional Insights</CardTitle>
                    <CardDescription>Your mood summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {moodEntries.length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Current Mood</p>
                          <p className="text-lg font-bold mt-1 capitalize">{moodEntries[0]?.mood || "Not logged"}</p>
                          {moodEntries[0]?.note && (
                            <p className="text-sm text-muted-foreground mt-2 italic">"{moodEntries[0].note}"</p>
                          )}
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Tracked</p>
                          <p className="text-lg font-bold mt-1">{moodEntries.length} moods</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Tracking Since</p>
                          <p className="text-lg font-bold mt-1">
                            {moodEntries.length > 0 
                              ? new Date(moodEntries[moodEntries.length - 1]?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : 'Not started'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">No mood data yet. Start tracking in the Mood tab!</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Music Suggestions Section */}
              {recentMood && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <MusicSuggestions recentMood={recentMood} />
                </div>
              )}

              {/* Daily Quote Section */}
              <div>
                <DailyQuote />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
