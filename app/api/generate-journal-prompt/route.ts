/**
 * API Route: Generate Journal Prompt
 * POST /api/generate-journal-prompt
 * Securely generates personalized journal prompts using OpenAI on the server
 */

import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { entryTitle } = body

    // Validate input
    if (typeof entryTitle !== 'string' || !entryTitle.trim()) {
      return NextResponse.json(
        {
          prompt: "What's on your mind today? Take a moment to share your thoughts and feelings.",
          followUp: "What emotions are you experiencing right now?",
          emoji: "📝",
        },
        { status: 200 }
      )
    }

    // Initialize OpenAI client (uses OPENAI_API_KEY env var)
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are an empathetic journaling coach. Based on the entry title provided by the user, generate a caring, personalized prompt that:
1. Acknowledges what they're about to journal about
2. Asks them to explore their feelings or thoughts about this topic
3. Makes them feel heard and understood
4. Is warm, supportive, and encouraging

You MUST respond with ONLY valid JSON in this exact format, no other text:
{
  "prompt": "A caring question about their topic (30-50 words)",
  "followUp": "A deeper follow-up question (20-40 words)",
  "emoji": "One relevant emoji"
}`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Entry title: "${entryTitle}"`,
        },
      ],
    })

    // Extract the response text
    const responseText =
      response.choices[0]?.message?.content || ''

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response")
    }

    const promptData = JSON.parse(jsonMatch[0])

    // Validate response structure
    if (!promptData.prompt || !promptData.followUp || !promptData.emoji) {
      throw new Error("Invalid prompt structure in response")
    }

    return NextResponse.json({
      success: true,
      prompt: promptData.prompt,
      followUp: promptData.followUp,
      emoji: promptData.emoji,
    })
  } catch (error) {
    console.error("Error generating journal prompt:", error)

    // Return fallback prompt on error
    return NextResponse.json(
      {
        success: false,
        prompt:
          "What's on your mind today? Take a moment to share your thoughts and feelings.",
        followUp: "What emotions are you experiencing right now?",
        emoji: "📝",
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate personalized prompt",
      },
      { status: 200 } // Return 200 so client still shows prompt
    )
  }
}
