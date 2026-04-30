/**
 * API Route: Generate Kindness Ideas
 * POST /api/generate-kindness
 * Securely generates kindness ideas using OpenAI
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateSingleKindnessIdea } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { userRole = 'general', previousIdeas = [] } = body

    // Validate input
    if (typeof userRole !== 'string') {
      return NextResponse.json(
        { error: 'Invalid userRole parameter' },
        { status: 400 }
      )
    }

    if (!Array.isArray(previousIdeas)) {
      return NextResponse.json(
        { error: 'previousIdeas must be an array' },
        { status: 400 }
      )
    }

    // Generate kindness idea using AI
    const idea = await generateSingleKindnessIdea(userRole, previousIdeas)

    // Return generated idea
    return NextResponse.json(
      {
        success: true,
        idea: {
          description: idea.description,
          category: idea.category,
          source: 'ai', // Mark as AI-generated
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in generate-kindness API:', error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate kindness idea. Please try again.',
      },
      { status: 500 }
    )
  }
}
