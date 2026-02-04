"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  addJournalEntry,
  deleteJournalEntry,
  moodOptions,
  type JournalEntry,
} from "@/lib/data"
import { getRandomJournalPrompt } from "@/lib/journal-prompts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { BookOpen, Plus, Trash2, Loader2, Calendar } from "lucide-react"

interface JournalProps {
  entries: JournalEntry[]
  onUpdate: () => void
  loading: boolean
}

export function Journal({ entries, onUpdate, loading }: JournalProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!user || !title.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setIsSubmitting(true)
    try {
      await addJournalEntry(user.id, title, content, selectedMood || undefined)
      toast.success("Journal entry saved!")
      setTitle("")
      setContent("")
      setSelectedMood(null)
      setIsOpen(false)
      onUpdate()
    } catch (error) {
      toast.error("Failed to save journal entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    setDeleteLoading(entryId)
    try {
      await deleteJournalEntry(entryId)
      toast.success("Journal entry deleted")
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete entry")
    } finally {
      setDeleteLoading(null)
    }
  }

  const randomPrompt = getRandomJournalPrompt()

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-chart-3/10 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Reflection Journal</CardTitle>
              <CardDescription>{entries.length} entries</CardDescription>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
                <DialogDescription>
                  Write about your thoughts, feelings, or experiences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground italic">
                  Prompt: {randomPrompt}
                </div>
                <Input
                  placeholder="Give your entry a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-input border-border"
                />
                <Textarea
                  placeholder="Write your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] resize-none bg-input border-border"
                />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                          selectedMood === mood.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border/50 hover:border-primary/50 text-muted-foreground bg-transparent"
                        }`}
                      >
                        {mood.emoji} {mood.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Entry"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 px-4">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No journal entries yet. Start reflecting!</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <div className="p-4 space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.mood && (
                          <span className="text-lg">
                            {moodOptions.find((m) => m.value === entry.mood)?.emoji}
                          </span>
                        )}
                        <h4 className="font-medium text-foreground truncate">{entry.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {entry.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleteLoading === entry.id}
                    >
                      {deleteLoading === entry.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
