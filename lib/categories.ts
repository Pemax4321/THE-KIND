/**
 * Category Configuration
 * Defines all kindness categories and their styling
 */

// Array of all possible kindness categories
export const KINDNESS_CATEGORIES = [
  "Connection", // For acts involving social connection
  "Daily Life", // For everyday kindness
  "Digital", // For online/digital acts
  "Academic", // For school/study related acts
  "Community", // For community and volunteer acts
] as const

// Type derived from the categories array
export type KindnessCategory = (typeof KINDNESS_CATEGORIES)[number]

// Color scheme mapping for each category
export const CATEGORY_COLORS: Record<KindnessCategory, string> = {
  Connection: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Daily Life": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Digital: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Academic: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Community: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

// Helper function to get color classes for a category
// Returns fallback color if category not found
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as KindnessCategory] || "bg-muted text-muted-foreground"
}
