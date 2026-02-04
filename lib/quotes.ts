/**
 * Daily Quotes Configuration
 * Inspirational quotes about kindness
 */

export interface Quote {
  quote: string
  author: string
}

export const DAILY_QUOTES: Quote[] = [
  { quote: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" },
  { quote: "Be kind whenever possible. It is always possible.", author: "Dalai Lama" },
  {
    quote: "Kindness is a language which the deaf can hear and the blind can see.",
    author: "Mark Twain",
  },
  { quote: "In a world where you can be anything, be kind.", author: "Jennifer Dukes Lee" },
  {
    quote: "Carry out a random act of kindness, with no expectation of reward.",
    author: "Princess Diana",
  },
  { quote: "One kind word can change someone's entire day.", author: "Unknown" },
  {
    quote: "The smallest act of kindness is worth more than the grandest intention.",
    author: "Oscar Wilde",
  },
  {
    quote: "Kindness begins with the understanding that we all struggle.",
    author: "Charles Glassman",
  },
  { quote: "A warm smile is the universal language of kindness.", author: "William Arthur Ward" },
  { quote: "Kindness is the sunshine in which virtue grows.", author: "Robert Green Ingersoll" },
  {
    quote: "Remember there's no such thing as a small act of kindness. Every act makes a difference.",
    author: "Unknown",
  },
  { quote: "Spreading kindness is the most effective form of activism.", author: "Unknown" },
  {
    quote: "Be the change you wish to see in the world through acts of daily kindness.",
    author: "Unknown",
  },
  { quote: "Kindness is free. Sprinkle that stuff everywhere.", author: "Unknown" },
  {
    quote: "The purpose of our lives is to be happy and spread happiness to others.",
    author: "Dalai Lama",
  },
]

/**
 * Gets a quote for the current day
 * Same quote is returned for the same calendar day across different sessions
 */
export function getDailyQuote(): Quote {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]
}
