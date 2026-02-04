"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { moodOptions, addMoodEntry, type MoodEntry } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SmilePlus, Loader2 } from "lucide-react"

interface MoodTrackerProps {
  onMoodLogged: () => void
  recentMoods: MoodEntry[]
}

export function MoodTracker({ onMoodLogged, recentMoods }: MoodTrackerProps) {
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || !selectedMood) return
    setIsSubmitting(true)
    try {
      await addMoodEntry(user.id, selectedMood, note || undefined)
      toast.success("Mood logged successfully!")
      setSelectedMood(null)
      setNote("")
      onMoodLogged()
    } catch (error) {
      toast.error("Failed to log mood")
    } finally {
      setIsSubmitting(false)
    }
  }

  const todaysMood = recentMoods.find((m) => {
    const today = new Date()
    return m.createdAt.toDateString() === today.toDateString()
  })

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-chart-4/10 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-chart-4/20 flex items-center justify-center">
            <SmilePlus className="w-5 h-5 text-chart-4" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">How are you feeling?</CardTitle>
            <CardDescription>
              {todaysMood ? "You've logged your mood today" : "Track your mood daily"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {todaysMood ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">
              {moodOptions.find((m) => m.value === todaysMood.mood)?.emoji}
            </div>
            <p className="text-sm text-muted-foreground">
              You're feeling{" "}
              <span className="font-medium text-foreground">
                {moodOptions.find((m) => m.value === todaysMood.mood)?.label}
              </span>{" "}
              today
            </p>
            {todaysMood.note && (
              <p className="text-sm text-muted-foreground mt-2 italic">"{todaysMood.note}"</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/50 hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-muted-foreground">{mood.label}</div>
                </button>
              ))}
            </div>
            {selectedMood && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <Textarea
                  placeholder="Add a note about how you're feeling (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none bg-input border-border"
                  rows={3}
                />
                <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    "Log My Mood"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
