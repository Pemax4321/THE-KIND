/**
 * Kindness Ideas Configuration - AI-Powered
 * All kindness ideas are now generated dynamically using OpenAI
 * No hardcoded ideas - unlimited possibilities!
 */

export interface DefaultKindnessIdea {
  description: string
  category: string
  source?: 'ai' // Marks that this idea came from AI
}

/**
 * Generate a random kindness idea using AI
 * This function is deprecated - use client-side API call to /api/generate-kindness instead
 */
export function getRandomKindnessIdea(): DefaultKindnessIdea {
  throw new Error('Use /api/generate-kindness endpoint for AI-generated ideas')
}

/**
 * Get kindness ideas filtered by user role
 * @param role - User role: 'student', 'lecturer', or 'general'
 * @returns This function now delegates to AI generation
 */
export function getKindnessIdeasByRole(role: string | null | undefined): DefaultKindnessIdea[] {
  throw new Error('Use /api/generate-kindness endpoint for AI-generated ideas. Pass userRole in request body.')
}

/**
 * Get a random kindness idea based on user role
 * @param role - User role: 'student', 'lecturer', or 'general'
 * @returns This function now delegates to AI generation
 */
export function getRandomKindnessIdeaByRole(role: string | null | undefined): DefaultKindnessIdea {
  throw new Error('Use /api/generate-kindness endpoint for AI-generated ideas. Pass userRole in request body.')
}