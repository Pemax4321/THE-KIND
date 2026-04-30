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
  { quote: "Every person has the ability to be kind. Use it every single day.", author: "Evan Carmen" },
  { quote: "Kindness is strength.", author: "Unknown" },
  { quote: "What a wonderful life I've had; I only wish I'd realized it sooner.", author: "Colette" },
  { quote: "Humanity is divided into two groups: those who are kind and those who are not.", author: "Unknown" },
  { quote: "Kindness in words creates confidence. Kindness in thinking creates profundity. Kindness in giving creates love.", author: "Lao Tzu" },
  { quote: "The world breaks everyone, and afterward, many attempt kindness.", author: "Hemingway" },
  { quote: "Three things in human life are important: the first is to be kind; the second is to be kind; and the third is to be kind.", author: "Henry James" },
  { quote: "If you have the ability to stay calm, that's a form of kindness too.", author: "Unknown" },
  { quote: "Kindness has wings—it flies to hearts near and far.", author: "Dodge" },
  { quote: "My religion is very simple. My religion is kindness.", author: "Dalai Lama" },
  { quote: "Every bit of effort counts when you're doing good.", author: "Unknown" },
  { quote: "Tender words we speak to one another are as those invisible threads we use to tie hearts together.", author: "Frederick F. Van Ryn" },
  { quote: "Do not wait for leaders; do it alone, person to person.", author: "Mother Teresa" },
  { quote: "Kindness is the act of giving those who need it their dignity back.", author: "Maya Angelou" },
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
