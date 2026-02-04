/**
 * Journal Prompts Configuration
 * Prompts to help users reflect and journal
 */

export const JOURNAL_PROMPTS = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "Describe a kind act you witnessed or performed.",
  "How did you take care of yourself today?",
  "What's one positive thing you learned today?",
  "Who did you help today and how?",
  "What act of kindness do you want to do tomorrow?",
  "How did someone's kindness impact you recently?",
  "What challenged you today and how did you handle it?",
  "Describe a moment when you felt truly present.",
]

export function getRandomJournalPrompt(): string {
  return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
}
