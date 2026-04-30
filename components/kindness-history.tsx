"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCompletedKindnessActs, type KindnessAct } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Calendar, Tag, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface KindnessHistoryProps {
  loading?: boolean
}

const categoryColors: Record<string, string> = {
  donation: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  volunteer: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  compliment: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
  help: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  community: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  other: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
}

export function KindnessHistory({ loading: initialLoading }: KindnessHistoryProps) {
  const { user } = useAuth()
  const [completedActs, setCompletedActs] = useState<KindnessAct[]>([])
  const [loading, setLoading] = useState(initialLoading ?? true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchCompletedActs = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const acts = await getCompletedKindnessActs(user.id)
        setCompletedActs(acts)
      } catch (error) {
        console.error("Error fetching completed acts:", error)
        toast.error("Failed to load kindness history")
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedActs()
  }, [user?.id])

  // Get unique categories
  const categories = Array.from(
    new Set(completedActs.map((act) => act.category))
  ).sort()

  // Filter acts by category
  const filteredActs =
    selectedCategory === "all"
      ? completedActs
      : completedActs.filter((act) => act.category === selectedCategory)

  // Calculate stats
  const totalCompleted = completedActs.length
  const currentMonthActs = completedActs.filter((act) => {
    const now = new Date()
    const actDate = act.completedAt || act.createdAt
    return (
      actDate.getMonth() === now.getMonth() &&
      actDate.getFullYear() === now.getFullYear()
    )
  })

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Your Kindness Record</CardTitle>
              <CardDescription>Track your completed acts of kindness</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Total Completed</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading your history...</span>
          </div>
        ) : completedActs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-muted-foreground mb-2">No completed acts yet</p>
            <p className="text-sm text-muted-foreground">
              Start logging and completing kindness acts to build your history!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border/50 bg-card">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {currentMonthActs.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">This Month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {categories.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Categories</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Filter by Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All ({totalCompleted})
                </button>
                {categories.map((category) => {
                  const count = completedActs.filter((act) => act.category === category).length
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {category} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Acts List */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                {selectedCategory === "all" ? "All Acts" : `${selectedCategory} Acts`}
              </p>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredActs.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-sm">No acts in this category</p>
                    </div>
                  ) : (
                    filteredActs.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm leading-relaxed break-words">
                              {act.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className={`capitalize text-xs ${
                                  categoryColors[act.category.toLowerCase()] ||
                                  categoryColors.other
                                }`}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {act.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {act.completedAt
                                  ? act.completedAt.toLocaleDateString()
                                  : act.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-2xl shrink-0">✅</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Amazing work!</span> You've completed{" "}
                <span className="font-bold text-green-600 dark:text-green-400">{totalCompleted}</span>{" "}
                acts of kindness. Keep spreading positivity! 🌟
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
