/**
 * API Route: Generate Music Suggestions
 * POST /api/generate-music
 * Securely generates mood-based music suggestions using OpenAI
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateMusicSuggestionsAI } from '@/lib/music-ai-service'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { mood, context = '', count = 3 } = body

    // Validate input
    if (typeof mood !== 'string' || !mood.trim()) {
      return NextResponse.json(
        { error: 'Mood parameter is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (typeof count !== 'number' || count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'Count must be a number between 1 and 10' },
        { status: 400 }
      )
    }

    // Generate music suggestions using AI
    const suggestions = await generateMusicSuggestionsAI(
      mood,
      typeof context === 'string' ? context : '',
      Math.min(count, 10) // Cap at 10 suggestions
    )

    // Return generated suggestions
    return NextResponse.json(
      {
        success: true,
        suggestions: suggestions,
        mood: mood,
        count: suggestions.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in generate-music API:', error)

    // Check for quota errors
    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        {
          success: false,
          error: 'API quota exceeded. Please try again later.',
        },
        { status: 429 }
      )
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate music suggestions. Please try again.',
      },
      { status: 500 }
    )
  }
}
