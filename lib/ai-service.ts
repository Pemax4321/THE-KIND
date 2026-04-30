/**
 * AI Service - Generates unlimited kindness ideas using OpenAI
 * Uses Claude for creative and personalized kindness act suggestions
 */

import { OpenAI } from 'openai'

// Initialize OpenAI client (only works on server-side)
export const initializeOpenAI = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI service can only be used on the server side')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface GenerateKindnessIdeasParams {
  userRole?: string
  category?: string
  previousIdeas?: string[]
  count?: number
}

/**
 * Generate creative kindness ideas using OpenAI
 * @param params - Configuration for generating ideas
 * @returns Array of generated kindness ideas
 */
export async function generateKindnessIdeasAI(
  params: GenerateKindnessIdeasParams = {}
): Promise<{ description: string; category: string }[]> {
  try {
    const { userRole = 'general', category, previousIdeas = [], count = 1 } = params

    // Build context about previous ideas to avoid duplicates
    const previousContext = previousIdeas.length > 0 
      ? `\n\nDo NOT suggest these ideas (already provided):\n${previousIdeas.slice(0, 5).join('\n')}`
      : ''

    // Build category constraint
    const categoryConstraint = category 
      ? `\nAll ideas must be in the "${category}" category.`
      : '\nUse a variety of categories like: Daily Life, Connection, Community, Digital, Academic, Professional, Family, etc.'

    const prompt = `You are a kind and empathetic assistant helping people spread kindness in their daily lives.

Generate ${count} creative, specific, and actionable kindness ideas for a ${userRole} user.

Requirements:
1. Each idea should be specific and actionable (not generic)
2. Ideas should be realistic and doable in 1-24 hours
3. Mix small acts with medium-effort acts
4. Be creative and inspiring${categoryConstraint}
5. Format EXACTLY as JSON array with objects containing "description" (string) and "category" (string)${previousContext}

Example format:
[
  {"description": "Leave a thank you note for your mail carrier", "category": "Community"},
  {"description": "Send a voice message instead of text to a friend", "category": "Connection"}
]

Generate only the JSON array, no other text.`

    const client = initializeOpenAI()

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

    const ideas = JSON.parse(jsonMatch[0])

    // Validate and clean up response
    return ideas.map((idea: any) => ({
      description: String(idea.description || '').trim(),
      category: String(idea.category || 'Daily Life').trim(),
    })).filter((idea: any) => idea.description.length > 0)
  } catch (error) {
    console.error('Error generating kindness ideas:', error)
    throw new Error('Failed to generate kindness ideas')
  }
}

/**
 * Generate a single kindness idea (convenience function)
 */
export async function generateSingleKindnessIdea(
  userRole?: string,
  previousIdeas?: string[]
): Promise<{ description: string; category: string }> {
  const ideas = await generateKindnessIdeasAI({
    userRole,
    previousIdeas,
    count: 1,
  })
  return ideas[0]
}

/**
 * Generate batch of kindness ideas for different categories
 */
export async function generateKindnessIdeasByCategory(
  userRole?: string,
  count: number = 5
): Promise<{ description: string; category: string }[]> {
  const categories = ['Daily Life', 'Connection', 'Community', 'Digital', 'Professional']
  const allIdeas: { description: string; category: string }[] = []

  for (const category of categories) {
    try {
      const ideas = await generateKindnessIdeasAI({
        userRole,
        category,
        count: Math.ceil(count / categories.length),
      })
      allIdeas.push(...ideas)
    } catch (error) {
      console.warn(`Failed to generate ideas for category ${category}:`, error)
    }
  }

  return allIdeas.slice(0, count)
}
