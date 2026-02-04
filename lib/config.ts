/**
 * Application Configuration and Constants
 * Centralized location for all hardcoded values that were previously scattered throughout the app
 */

export const APP_CONFIG = {
  // App Info
  appName: process.env.NEXT_PUBLIC_APP_NAME || "THE KIND",
  appLoadingMessage: "Loading THE KIND...",

  // Data limits
  moods: {
    historyDays: parseInt(process.env.NEXT_PUBLIC_DAYS_FOR_MOOD_HISTORY || "30"),
    maxEntriesPerQuery: 50,
  },

  kindness: {
    maxEntriesPerQuery: 50,
  },

  // Supabase tables
  collections: {
    kindnessActs: process.env.NEXT_PUBLIC_KINDNESS_ACTS_TABLE || "kindness_acts",
    customIdeas: process.env.NEXT_PUBLIC_CUSTOM_IDEAS_TABLE || "custom_kindness_ideas",
    moods: process.env.NEXT_PUBLIC_MOODS_TABLE || "moods",
    journals: process.env.NEXT_PUBLIC_JOURNALS_TABLE || "journals",
  },

  // UI messages
  messages: {
    moodLoggedSuccess: "Mood logged successfully!",
    moodLoggedError: "Failed to log mood",
    kindnessAddedSuccess: "Kindness act added to your list!",
    kindnessAddedError: "Failed to add kindness act",
    kindnessCompletedSuccess: "Great job! Kindness completed!",
    kindnessCompletedError: "Failed to mark as complete",
    kindnessDeletedSuccess: "Kindness act removed",
    kindnessDeletedError: "Failed to delete",
    journalSavedSuccess: "Journal entry saved!",
    journalSavedError: "Failed to save journal entry",
    journalDeletedSuccess: "Journal entry deleted",
    journalDeletedError: "Failed to delete entry",
    customIdeaSavedSuccess: "Custom kindness idea saved!",
    customIdeaSavedError: "Failed to save custom idea",
    customIdeaDeletedSuccess: "Custom idea removed",
    customIdeaDeletedError: "Failed to delete idea",
    fillAllFieldsError: "Please fill in all fields",
    nameRequiredError: "Please enter your name",
    welcomeBackMessage: "Welcome back!",
    accountCreatedSuccess: "Account created successfully!",
  },
}
