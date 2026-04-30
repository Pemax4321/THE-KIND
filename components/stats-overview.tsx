// Stats Overview component - displays key user statistics
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Flame, Target, Award } from "lucide-react"
import type { UserStats } from "@/lib/data"

// Props interface for StatsOverview
interface StatsOverviewProps {
  stats: UserStats | null // User statistics data
  loading: boolean // Loading state indicator
}

// StatsOverview component - displays grid of user statistics cards
export function StatsOverview({ stats, loading }: StatsOverviewProps) {
  // Define all stat items to display
  const statItems = [
    {
      label: "Total Acts",
      value: stats?.totalKindnessActs ?? 0,
      icon: Heart,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Completed",
      value: stats?.completedKindnessActs ?? 0,
      icon: Target,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Current Streak",
      value: stats?.currentStreak ?? 0,
      suffix: " days",
      icon: Flame,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Best Streak",
      value: stats?.longestStreak ?? 0,
      suffix: " days",
      icon: Award,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="shadow-md border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Stat icon with background color */}
              <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              {/* Stat value and label */}
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "-" : item.value}
                  {/* Optional suffix (e.g., " days" for streaks) */}
                  {item.suffix && !loading && <span className="text-sm font-normal text-muted-foreground">{item.suffix}</span>}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
