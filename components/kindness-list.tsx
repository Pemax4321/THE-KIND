"use client"

import { useState } from "react"
import { completeKindnessAct, deleteKindnessAct, type KindnessAct } from "@/lib/data"
import { getCategoryColor } from "@/lib/categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Check, Trash2, Heart, Loader2 } from "lucide-react"

interface KindnessListProps {
  acts: KindnessAct[]
  onUpdate: () => void
  loading: boolean
}

export function KindnessList({ acts, onUpdate, loading }: KindnessListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleComplete = async (actId: string) => {
    setActionLoading(actId)
    try {
      await completeKindnessAct(actId)
      toast.success("Great job! Kindness completed!")
      onUpdate()
    } catch (error) {
      toast.error("Failed to mark as complete")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (actId: string) => {
    setActionLoading(actId)
    try {
      await deleteKindnessAct(actId)
      toast.success("Kindness act removed")
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete")
    } finally {
      setActionLoading(null)
    }
  }

  const getCategoryColorClass = (category: string) => {
    return getCategoryColor(category)
  }

  const pendingActs = acts.filter((act) => !act.completed)
  const completedActs = acts.filter((act) => act.completed)

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-accent/30 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">My Kindness List</CardTitle>
            <CardDescription>
              {pendingActs.length} pending, {completedActs.length} completed
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : acts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No kindness acts yet. Generate one above!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {pendingActs.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className={`mb-2 text-xs ${getCategoryColorClass(act.category)}`}>
                        {act.category}
                      </Badge>
                      <p className="text-sm text-foreground">{act.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added {act.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10"
                        onClick={() => handleComplete(act.id)}
                        disabled={actionLoading === act.id}
                      >
                        {actionLoading === act.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">Complete</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(act.id)}
                        disabled={actionLoading === act.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {completedActs.length > 0 && (
                <>
                  <div className="py-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</p>
                  </div>
                  {completedActs.slice(0, 5).map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-lg border border-border/30 bg-muted/20 opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground line-through">{act.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Completed {act.completedAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
