import { supabase } from "./supabase"
import { DEFAULT_KINDNESS_IDEAS } from "./kindness-ideas"
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
  createdAt: Date
}

// Kindness Acts - Using default ideas from configuration
export const kindnessIdeas = DEFAULT_KINDNESS_IDEAS

export function getRandomKindnessIdea() {
  return kindnessIdeas[Math.floor(Math.random() * kindnessIdeas.length)]
}

// Custom User-Added Kindness Ideas
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
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    description: item.description,
    category: item.category,
    createdAt: new Date(item.created_at),
  }))
}

export async function deleteCustomKindnessIdea(ideaId: string) {
  const { error } = await supabase
    .from(APP_CONFIG.collections.customIdeas)
    .delete()
    .eq("id", ideaId)

  if (error) throw error
}

export function getRandomKindnessIdeaWithCustom(customIdeas: CustomKindnessIdea[]) {
  const allIdeas = [
    ...kindnessIdeas,
    ...customIdeas.map((idea) => ({ description: idea.description, category: idea.category }))
  ]
  return allIdeas[Math.floor(Math.random() * allIdeas.length)]
}

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
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.kindnessActs)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(APP_CONFIG.kindness.maxEntriesPerQuery)

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

// Mood Tracking
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
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.moods)
    .insert([
      {
        user_id: userId,
        mood,
        note,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function getMoodEntries(userId: string, days: number = APP_CONFIG.moods.historyDays): Promise<MoodEntry[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from(APP_CONFIG.collections.moods)
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startDate.toISOString())
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
  const { data, error } = await supabase
    .from(APP_CONFIG.collections.journals)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(APP_CONFIG.kindness.maxEntriesPerQuery)

  if (error) throw error

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content,
    mood: item.mood,
    createdAt: new Date(item.created_at),
  }))
}

// User Stats
export async function getUserStats(userId: string): Promise<UserStats> {
  const kindnessActs = await getKindnessActs(userId)
  const moods = await getMoodEntries(userId, 30)

  const totalKindnessActs = kindnessActs.length
  const completedKindnessActs = kindnessActs.filter((act) => act.completed).length

  // Calculate streak
  const completedDates = kindnessActs
    .filter((act) => act.completed && act.completedAt)
    .map((act) => act.completedAt!.toDateString())

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

// Daily Quotes
export function getDailyQuoteFromData() {
  return getDailyQuote()
}

// Music Suggestions based on mood
export function getMusicForMoodData(mood: string) {
  return getMusicForMood(mood)
}
