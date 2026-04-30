/**
 * AI Music Service - Generates mood-based music suggestions using OpenAI
 * Uses Claude to understand mood and recommend personalized music
 */

import { OpenAI } from 'openai'

export interface AIMusicSuggestion {
  title: string
  artist: string
  genre: string
  reason: string // Why this song matches the mood
}

/**
 * Generate AI-powered mood-based music suggestions
 * @param mood - User's current mood
 * @param context - Additional context about why they feel this way
 * @param count - Number of suggestions to generate
 * @returns Array of music suggestions with explanations
 */
export async function generateMusicSuggestionsAI(
  mood: string,
  context: string = '',
  count: number = 3
): Promise<AIMusicSuggestion[]> {
  try {
    const prompt = `You are a music recommendation expert. Based on the user's mood and context, recommend ${count} songs that would be perfect for them right now.

User's mood: "${mood}"
${context ? `Additional context: "${context}"` : ''}

For each recommendation, provide:
1. Song title
2. Artist name
3. Genre
4. Brief reason why this song matches their mood

Return ONLY a JSON array with objects containing these exact fields: "title", "artist", "genre", "reason".

Example format:
[
  {
    "title": "Song Name",
    "artist": "Artist Name",
    "genre": "Genre",
    "reason": "This uplifting song will help lift your spirits..."
  }
]

Generate diverse recommendations across different styles. Only return the JSON array, no other text.`

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const message = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    })

    // Extract text from response
    const textContent = message.choices[0]?.message?.content
    if (!textContent) {
      throw new Error('No text content in response')
    }

    // Parse JSON response
    const jsonMatch = textContent.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response')
    }

    const suggestions = JSON.parse(jsonMatch[0])

    // Validate and clean up response
    return suggestions
      .map((suggestion: any) => ({
        title: String(suggestion.title || '').trim(),
        artist: String(suggestion.artist || '').trim(),
        genre: String(suggestion.genre || '').trim(),
        reason: String(suggestion.reason || '').trim(),
      }))
      .filter((suggestion: any) => suggestion.title && suggestion.artist)
  } catch (error) {
    console.error('Error generating music suggestions:', error)
    throw new Error('Failed to generate music suggestions')
  }
}

/**
 * Generate a single music suggestion for a specific mood
 */
export async function generateSingleMusicSuggestion(
  mood: string,
  context?: string
): Promise<AIMusicSuggestion> {
  const suggestions = await generateMusicSuggestionsAI(mood, context, 1)
  return suggestions[0]
}

/**
 * Get multiple music suggestions with different vibes for the same mood
 */
export async function generateDiverseMusicSuggestions(
  mood: string,
  context?: string,
  count: number = 5
): Promise<AIMusicSuggestion[]> {
  return generateMusicSuggestionsAI(mood, context, count)
}
