/**
 * Category Configuration
 * Defines all kindness categories and their styling
 */

export const KINDNESS_CATEGORIES = [
  "Connection",
  "Daily Life",
  "Digital",
  "Academic",
  "Community",
] as const

export type KindnessCategory = (typeof KINDNESS_CATEGORIES)[number]

export const CATEGORY_COLORS: Record<KindnessCategory, string> = {
  Connection: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Daily Life": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Digital: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Academic: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Community: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as KindnessCategory] || "bg-muted text-muted-foreground"
}
