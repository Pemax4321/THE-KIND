/**
 * Music Suggestions Configuration
 * Mood-based music recommendations
 */

export interface MusicSuggestion {
  title: string
  artist: string
  genre: string
}

export const MUSIC_SUGGESTIONS: Record<string, MusicSuggestion[]> = {
  happy: [
    { title: "Happy", artist: "Pharrell Williams", genre: "Pop" },
    { title: "Good Vibrations", artist: "The Beach Boys", genre: "Rock" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Pop" },
    { title: "Shut Up and Dance", artist: "Walk the Moon", genre: "Indie Pop" },
    { title: "Don't Stop Me Now", artist: "Queen", genre: "Rock" },
  ],
  calm: [
    { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
    { title: "Clair de Lune", artist: "Debussy", genre: "Classical" },
    { title: "River Flows in You", artist: "Yiruma", genre: "Classical" },
    { title: "Jóia de Brinco", artist: "Os Mutantes", genre: "Bossa Nova" },
    { title: "Breathe", artist: "The Cinematic Orchestra", genre: "Jazz" },
  ],
  sad: [
    { title: "Fix You", artist: "Coldplay", genre: "Alternative" },
    { title: "Someone Like You", artist: "Adele", genre: "Pop" },
    { title: "Skinny Love", artist: "Bon Iver", genre: "Indie" },
    { title: "Hurt", artist: "Johnny Cash", genre: "Country" },
    { title: "Mad World", artist: "Gary Jules", genre: "Alternative" },
  ],
  anxious: [
    { title: "Breathe Me", artist: "Sia", genre: "Pop" },
    { title: "Sunset Lover", artist: "Petit Biscuit", genre: "Electronic" },
    { title: "Ocean Eyes", artist: "Billie Eilish", genre: "Pop" },
    { title: "Night Moves", artist: "Iron & Wine", genre: "Folk" },
    { title: "Healing", artist: "The Script", genre: "Rock" },
  ],
  frustrated: [
    { title: "Shake It Off", artist: "Taylor Swift", genre: "Pop" },
    { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock" },
    { title: "Stronger", artist: "Kelly Clarkson", genre: "Pop" },
    { title: "We Will Rock You", artist: "Queen", genre: "Rock" },
    { title: "Pump It Up", artist: "Endor", genre: "Electronic" },
  ],
  loved: [
    { title: "All of Me", artist: "John Legend", genre: "R&B" },
    { title: "Perfect", artist: "Ed Sheeran", genre: "Pop" },
    { title: "At Last", artist: "Etta James", genre: "Jazz" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop" },
    { title: "Make You Feel My Love", artist: "Adele", genre: "Pop" },
  ],
  grateful: [
    { title: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz" },
    { title: "Count on Me", artist: "Bruno Mars", genre: "Pop" },
    { title: "Lean on Me", artist: "Bill Withers", genre: "Soul" },
    { title: "Good as Hell", artist: "Lizzo", genre: "Pop" },
    { title: "Beautiful", artist: "Christina Aguilera", genre: "Pop" },
  ],
  neutral: [
    { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock" },
    { title: "Three Little Birds", artist: "Bob Marley", genre: "Reggae" },
    { title: "Don't Worry Be Happy", artist: "Bobby McFerrin", genre: "Jazz" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Pop" },
    { title: "Good Day", artist: "Nappy Roots", genre: "Hip Hop" },
  ],
}

export function getMusicForMood(mood: string): MusicSuggestion[] {
  return MUSIC_SUGGESTIONS[mood] || MUSIC_SUGGESTIONS.neutral
}

/**
 * Get a YouTube search URL for a song
 */
export function getYouTubeSearchUrl(title: string, artist: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist}`)}`
}
