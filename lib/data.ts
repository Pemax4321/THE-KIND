import { supabase } from "./supabase"
import { getDailyQuote } from "./quotes"
import { getMusicForMood, type MusicSuggestion } from "./music-config"
import { APP_CONFIG } from "./config"

// Types
export interface KindnessAct {
  id: string
  userId: string
  description: string
  category: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

export interface MoodEntry {
  id: string
  userId: string
  mood: string
  note?: string
  createdAt: Date
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  mood?: string
  createdAt: Date
}

export interface UserStats {
  totalKindnessActs: number
  completedKindnessActs: number
  currentStreak: number
  longestStreak: number
  moodHistory: { mood: string; count: number }[]
}

export interface CustomKindnessIdea {
  id: string
  userId: string
  description: string
  category: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

/**
 * Generate a random kindness idea using AI via API
 * This function calls the secure backend endpoint
 * @param userRole - User's role for personalized suggestions
 * @param previousIdeas - Previous ideas to avoid duplicates
 */
export async function getRandomKindnessIdea(userRole?: string | null, previousIdeas: string[] = []) {
  try {
    const response = await fetch('/api/generate-kindness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userRole: userRole || 'general',
        previousIdeas: previousIdeas.slice(0, 10),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate kindness idea')
    }

    const data = await response.json()
    if (data.success && data.idea) {
      return {
        description: data.idea.description,
        category: data.idea.category,
        source: 'ai' as const,
      }
    }
    throw new Error(data.error || 'Failed to generate idea')
  } catch (error) {
    console.error('Error generating kindness idea:', error)
    throw error
  }
}

/**
 * Get a random kindness idea with role-based filtering and custom ideas
 * @param customIdeas - User's custom kindness ideas
 * @param userRole - User's role ('student', 'lecturer', or 'general')
 * @returns A random kindness idea appropriate for the user
 */
export async function getRandomKindnessIdeaWithCustom(customIdeas: CustomKindnessIdea[], userRole?: string | null) {
  try {
    // Try to get AI-generated idea first
    const aiIdea = await getRandomKindnessIdea(userRole, customIdeas.map(i => i.description))
    return aiIdea
  } catch (error) {
    console.warn('AI generation failed, using custom ideas:', error)
    // Fallback: return a random custom idea if available
    if (customIdeas.length > 0) {
      const randomCustom = customIdeas[Math.floor(Math.random() * customIdeas.length)]
      return {
        description: randomCustom.description,
        category: randomCustom.category,
      }
    }
    // If no custom ideas, throw error
    throw new Error('No ideas available. Please add custom ideas or check AI service.')
  }
}

export async function getAllSystemKindnessActs(): Promise<KindnessAct[]> {
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .select("*")
    .eq("is_system", true)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    description: item.description,
    category: item.category,
    completed: item.completed,
    createdAt: new Date(item.created_at),
    completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
  }))
}

// ============================================
// CUSTOM USER-ADDED KINDNESS IDEAS
// ============================================

export async function addCustomKindnessIdea(userId: string, description: string, category: string) {
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .insert([
      {
        user_id: userId,
        description,
        category,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function getCustomKindnessIdeas(userId: string): Promise<CustomKindnessIdea[]> {
  try {
    console.log("[DATA] getCustomKindnessIdeas: starting query for user", userId)
    const { data, error } = await supabase
      .from(APP_CONFIG.collections.customIdeas)
      .select("id,user_id,description,category,completed,created_at,completed_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[DATA] getCustomKindnessIdeas ERROR:", error.code, error.message)
      throw error
    }

    console.log("[DATA] getCustomKindnessIdeas: success, got", data?.length ?? 0, "rows")
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      description: item.description,
      category: item.category,
      completed: item.completed || false,
      createdAt: new Date(item.created_at),
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
    }))
  } catch (error) {
    console.error("[DATA] getCustomKindnessIdeas CAUGHT ERROR:", error)
    throw error
  }
}

export async function updateCustomKindnessIdea(ideaId: string, description: string, category: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .update({
      description,
      category,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ideaId)

  if (error) throw error
}

export async function completeCustomKindnessIdea(ideaId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", ideaId)

  if (error) throw error
}

export async function deleteCustomKindnessIdea(ideaId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .delete()
    .eq("id", ideaId)

  if (error) throw error
}

// ============================================
// KINDNESS ACT TRACKING (User Completions)
// ============================================

export async function addKindnessAct(userId: string, description: string, category: string) {
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .insert([
      {
        user_id: userId,
        description,
        category,
        completed: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function completeKindnessAct(actId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", actId)

  if (error) throw error
}

export async function deleteKindnessAct(actId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .delete()
    .eq("id", actId)

  if (error) throw error
}

export async function getKindnessActs(userId: string): Promise<KindnessAct[]> {
  try {
    console.log("[DATA] getKindnessActs: starting query for user", userId)
    const { data, error } = await supabase
      .from(APP_CONFIG.collections.kindnessActs)
      .select("id,user_id,description,category,completed,created_at,completed_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(APP_CONFIG.kindness.maxEntriesPerQuery)

    if (error) {
      console.error("[DATA] getKindnessActs ERROR:", error.code, error.message)
      throw error
    }

    console.log("[DATA] getKindnessActs: success, got", data?.length ?? 0, "rows")
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      description: item.description,
      category: item.category,
      completed: item.completed,
      createdAt: new Date(item.created_at),
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
    }))
  } catch (error) {
    console.error("[DATA] getKindnessActs CAUGHT ERROR:", error)
    throw error
  }
}

export async function getCompletedKindnessActs(userId: string): Promise<KindnessAct[]> {
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .select("*")
    .eq("user_id", userId)
    .eq("completed", true)
    .order("completed_at", { ascending: false })

  if (error) throw error

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    description: item.description,
    category: item.category,
    completed: item.completed,
    createdAt: new Date(item.created_at),
    completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
  }))
}

// ============================================
// MOOD TRACKING
// ============================================

export const moodOptions = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😤", label: "Frustrated", value: "frustrated" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "🥰", label: "Loved", value: "loved" },
  { emoji: "🤗", label: "Grateful", value: "grateful" },
]

export async function addMoodEntry(userId: string, mood: string, note?: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.moods)
    .insert([
      {
        user_id: userId,
        mood,
        note,
        created_at: new Date().toISOString(),
      },
    ])

  if (error) throw error
  // Return success without needing to fetch back the ID
}

export async function getMoodEntries(userId: string, days: number = APP_CONFIG.moods.historyDays): Promise<MoodEntry[]> {
  try {
    console.log("[DATA] getMoodEntries: starting query for user", userId, "days:", days)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from(APP_CONFIG.collections.moods)
      .select("id,user_id,mood,note,created_at")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[DATA] getMoodEntries ERROR:", error.code, error.message)
      throw error
    }

    console.log("[DATA] getMoodEntries: success, got", data?.length ?? 0, "rows")
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      mood: item.mood,
      note: item.note,
      createdAt: new Date(item.created_at),
    }))
  } catch (error) {
    console.error("[DATA] getMoodEntries CAUGHT ERROR:", error)
    throw error
  }
}

export async function getDailyMoodEntries(userId: string): Promise<MoodEntry[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from(APP_CONFIG.collections.moods)
    .select("id,user_id,mood,note,created_at")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    mood: item.mood,
    note: item.note,
    createdAt: new Date(item.created_at),
  }))
}

// Journal Entries
export async function addJournalEntry(userId: string, title: string, content: string, mood?: string) {
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.journals)
    .insert([
      {
        user_id: userId,
        title,
        content,
        mood,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function updateJournalEntry(entryId: string, title: string, content: string, mood?: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.journals)
    .update({
      title,
      content,
      mood,
    })
    .eq("id", entryId)

  if (error) throw error
}

export async function deleteJournalEntry(entryId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.journals)
    .delete()
    .eq("id", entryId)

  if (error) throw error
}

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    console.log("[DATA] getJournalEntries: starting query for user", userId)
    const { data, error } = await supabase
      .from(APP_CONFIG.collections.journals)
      .select("id,user_id,title,content,mood,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)

    if (error) {
      console.error("[DATA] getJournalEntries ERROR:", error.code, error.message)
      throw error
    }

    console.log("[DATA] getJournalEntries: success, got", data?.length ?? 0, "rows")
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      content: item.content,
      mood: item.mood,
      createdAt: new Date(item.created_at),
    }))
  } catch (error) {
    console.error("[DATA] getJournalEntries CAUGHT ERROR:", error)
    throw error
  }
}

// User Stats
/**
 * OPTIMIZED: Calculate stats from pre-fetched data to avoid N+1 queries
 * Use this when you already have the data from other fetches
 */
export function calculateUserStatsFromData(
  kindnessActs: KindnessAct[],
  customIdeas: CustomKindnessIdea[],
  moods: MoodEntry[]
): UserStats {
  // Combine regular kindness acts with completed custom ideas
  const allCompletedActs = kindnessActs.filter((act) => act.completed)
  const completedCustomIdeas = customIdeas.filter((idea) => idea.completed)

  const totalKindnessActs = kindnessActs.length + customIdeas.length
  const completedKindnessActs = allCompletedActs.length + completedCustomIdeas.length

  // Calculate streak including both regular acts and custom ideas
  const completedDates = [
    ...allCompletedActs.filter((act) => act.completedAt).map((act) => act.completedAt!.toDateString()),
    ...completedCustomIdeas.filter((idea) => idea.completedAt).map((idea) => idea.completedAt!.toDateString()),
  ]

  const uniqueDates = [...new Set(completedDates)]
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    if (uniqueDates.includes(checkDate.toDateString())) {
      tempStreak++
      if (i === 0 || tempStreak > 1) currentStreak = tempStreak
    } else if (tempStreak > 0) {
      longestStreak = Math.max(longestStreak, tempStreak)
      if (i > 0) break
      tempStreak = 0
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // Mood distribution
  const moodCounts: Record<string, number> = {}
  moods.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })
  const moodHistory = Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }))

  return {
    totalKindnessActs,
    completedKindnessActs,
    currentStreak,
    longestStreak,
    moodHistory,
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const kindnessActs = await getKindnessActs(userId)
  const customIdeas = await getCustomKindnessIdeas(userId)
  const moods = await getMoodEntries(userId, 30)

  return calculateUserStatsFromData(kindnessActs, customIdeas, moods)
}

export async function getMoodTrend(userId: string, days: number = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const moods = await getMoodEntries(userId, days)

  const trendData: { date: string; mood: string; count: number }[] = []

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    const dayMoods = moods.filter((m) => m.createdAt.toISOString().split("T")[0] === dateString)
    const moodCounts: Record<string, number> = {}

    dayMoods.forEach((m) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
    })

    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

    if (dominantMood) {
      trendData.push({
        date: dateString,
        mood: dominantMood[0],
        count: dominantMood[1],
      })
    }
  }

  return trendData
}

// Daily Quotes
export function getDailyQuoteFromData() {
  return getDailyQuote()
}