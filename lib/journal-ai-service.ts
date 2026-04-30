/**
 * Journal AI Service - Generates personalized journal prompts using AI
 * Creates caring, contextual prompts based on the entry title
 */

import { OpenAI } from 'openai'

export interface AIJournalPrompt {
  prompt: string
  followUp: string // Additional question to encourage deeper reflection
  emoji: string// Matching emoji for visual context
}

/**
 * Generate a personalized journal prompt based on entry title
 * Uses OpenAI to understand context and create caring, relevant prompts
 */
export async function generateJournalPrompt(
  entryTitle: string
): Promise<AIJournalPrompt> {
  try {
    // Handle empty title
    if (!entryTitle?.trim()) {
      return getDefaultPrompt()
    }

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

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `The user is writing a journal entry with the title: "${entryTitle}"

Generate a caring prompt that helps them reflect on this topic.`,
        },
      ],
    })

    // Extract the text content
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('Could not extract JSON from AI response, using default')
      return getDefaultPrompt()
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate response structure
    const prompt: AIJournalPrompt = {
      prompt: String(parsed.prompt || '').trim(),
      followUp: String(parsed.followUp || '').trim(),
      emoji: String(parsed.emoji || '📝').trim().slice(0, 2), // Ensure it's an emoji
    }

    // Fallback if parsing failed
    if (!prompt.prompt) {
      return getDefaultPrompt()
    }

    return prompt
  } catch (error) {
    console.error('Error generating AI journal prompt:', error)
    return getDefaultPrompt()
  }
}

/**
 * Generate multiple contextual messages for the journal experience
 */
export async function generateJournalContext(
  entryTitle: string
): Promise<{
  mainPrompt: AIJournalPrompt
  encouragement: string
}> {
  try {
    const mainPrompt = await generateJournalPrompt(entryTitle)

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `For someone writing a journal entry about "${entryTitle}", provide one short (1-2 sentences) encouraging message to help them feel comfortable sharing their feelings. Keep it warm and supportive.`,
        },
      ],
    })

    const encouragement = response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      mainPrompt,
      encouragement: encouragement.trim(),
    }
  } catch (error) {
    console.error('Error generating journal context:', error)
    return {
      mainPrompt: getDefaultPrompt(),
      encouragement: 'Take your time to express your feelings. There are no right or wrong words.',
    }
  }
}

/**
 * Default prompt fallback
 */
function getDefaultPrompt(): AIJournalPrompt {
  const defaults = [
    {
      prompt: 'What emotions are you experiencing right now?',
      followUp: 'What triggered these feelings?',
      emoji: '💭',
    },
    {
      prompt: 'Tell me more about what brought you to write this entry.',
      followUp: 'How do you hope this situation resolves?',
      emoji: '✨',
    },
    {
      prompt: 'What do you want to remember about this moment?',
      followUp: 'What lesson might this experience teach you?',
      emoji: '🌟',
    },
    {
      prompt: 'How are you feeling in this moment?',
      followUp: 'What do you need most right now?',
      emoji: '💚',
    },
  ]

  return defaults[Math.floor(Math.random() * defaults.length)]
}
