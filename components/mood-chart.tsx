"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { moodOptions, type MoodEntry } from "@/lib/data"
import { BarChart, Loader2 } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface MoodChartProps {
  moods: MoodEntry[]
  loading: boolean
}

export function MoodChart({ moods, loading }: MoodChartProps) {
  const moodCounts: Record<string, number> = {}
  moods.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })

  const chartData = moodOptions
    .map((mood) => ({
      mood: mood.emoji,
      label: mood.label,
      value: moodCounts[mood.value] || 0,
    }))
    .filter((d) => d.value > 0)

  const colors = [
    "oklch(0.65 0.18 45)",
    "oklch(0.75 0.12 160)",
    "oklch(0.7 0.15 250)",
    "oklch(0.8 0.15 100)",
    "oklch(0.6 0.2 340)",
  ]

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-chart-5/10 flex items-center justify-center">
            <BarChart className="w-4 h-4 text-chart-5" />
          </div>
          <div>
            <CardTitle className="text-base text-foreground">Mood Distribution</CardTitle>
            <CardDescription className="text-xs">Last 30 days</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            No mood data yet. Start tracking!
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="mood"
                  tick={{ fontSize: 16 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium text-foreground">
                            {data.mood} {data.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{data.value} entries</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
