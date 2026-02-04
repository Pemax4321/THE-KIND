/**
 * Default Kindness Ideas Configuration
 * These serve as the base collection of kindness acts
 */

export interface DefaultKindnessIdea {
  description: string
  category: string
}

export const DEFAULT_KINDNESS_IDEAS: DefaultKindnessIdea[] = [
  { description: "Send a heartfelt message to someone you appreciate", category: "Connection" },
  { description: "Hold the door open for the next person", category: "Daily Life" },
  { description: "Leave a positive comment on a friend's social media post", category: "Digital" },
  { description: "Share your notes with a classmate who missed class", category: "Academic" },
  { description: "Compliment a stranger's outfit or smile", category: "Daily Life" },
  { description: "Help someone carry their groceries or heavy items", category: "Daily Life" },
  { description: "Write a thank-you note to a teacher or mentor", category: "Academic" },
  { description: "Donate clothes or items you no longer need", category: "Community" },
  { description: "Listen actively to a friend who needs to vent", category: "Connection" },
  { description: "Buy coffee for the person behind you in line", category: "Daily Life" },
  { description: "Volunteer an hour of your time to a local cause", category: "Community" },
  { description: "Send a 'thinking of you' text to an old friend", category: "Connection" },
  { description: "Leave a generous tip for excellent service", category: "Daily Life" },
  { description: "Pick up litter in your neighborhood", category: "Community" },
  { description: "Offer to tutor a struggling classmate", category: "Academic" },
  { description: "Give someone a genuine, specific compliment", category: "Connection" },
  { description: "Share a helpful resource with your study group", category: "Academic" },
  { description: "Let someone go ahead of you in line", category: "Daily Life" },
  { description: "Send encouraging words to someone facing challenges", category: "Connection" },
  { description: "Help a neighbor with yard work or errands", category: "Community" },
  { description: "Create a playlist for someone who needs a mood boost", category: "Digital" },
  { description: "Leave a kind note for a delivery person", category: "Community" },
  { description: "Share your WiFi password with a neighbor in need", category: "Digital" },
  { description: "Offer your seat on public transport", category: "Daily Life" },
  { description: "Mentor someone junior to you at school or work", category: "Academic" },
]

export function getRandomKindnessIdea(): DefaultKindnessIdea {
  return DEFAULT_KINDNESS_IDEAS[Math.floor(Math.random() * DEFAULT_KINDNESS_IDEAS.length)]
}
