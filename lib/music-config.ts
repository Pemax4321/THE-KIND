/**
 * Music Suggestions Configuration
 * Mood-based music recommendations
 */

export interface MusicSuggestion {
  title: string
  artist: string
  genre: string
}

// All music suggestions are now powered by AI
// See lib/music-ai-service.ts for AI-generated suggestions
export const MUSIC_SUGGESTIONS: Record<string, MusicSuggestion[]> = {}

export function getMusicForMood(mood: string): MusicSuggestion[] {
  // Return empty array - AI will provide suggestions
  return []
}

/**
 * Get a YouTube search URL for a song
 */
export function getYouTubeSearchUrl(title: string, artist: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist}`)}`
}
