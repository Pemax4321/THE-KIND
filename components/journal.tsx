// Journal component - for creating and managing journal entries
"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  addJournalEntry,
  deleteJournalEntry,
  moodOptions,
  type JournalEntry,
} from "@/lib/data"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

// Interface for AI-generated journal prompts
interface AIJournalPrompt {
  prompt: string
  followUp: string
  emoji: string
}
import { BookOpen, Plus, Trash2, Loader2, Calendar, Sparkles } from "lucide-react"

// Props interface for Journal
interface JournalProps {
  entries: JournalEntry[] // Array of journal entries to display
  onUpdate: () => void // Callback to refresh data after changes
  loading: boolean // Loading state indicator
}

// Journal component - displays journal entries and allows creating new ones
export function Journal({ entries, onUpdate, loading }: JournalProps) {
  // Get user from auth context
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [title, setTitle] = useState("") // Entry title
  const [content, setContent] = useState("") // Entry content
  const [selectedMood, setSelectedMood] = useState<string | null>(null) // Associated mood
  const [isSubmitting, setIsSubmitting] = useState(false) // Submission loading state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null) // Deletion loading state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null) // Delete confirmation state
  
  // AI-powered prompt state
  const [aiPrompt, setAiPrompt] = useState<AIJournalPrompt | null>(null) // AI-generated prompt
  const [promptLoading, setPromptLoading] = useState(false) // Prompt generation loading state
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null) // Debounce timer for prompt generation

  // Generate AI prompt based on entry title (debounced)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Skip if title is empty or too short
    if (!title.trim() || title.length < 3) {
      setAiPrompt(null)
      return
    }

    // Set loading state
    setPromptLoading(true)

    // Debounce API call - wait 1 second after user stops typing
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Call server-side API route
        const response = await fetch('/api/generate-journal-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entryTitle: title,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        if (data.prompt && data.followUp && data.emoji) {
          setAiPrompt({
            prompt: data.prompt,
            followUp: data.followUp,
            emoji: data.emoji,
          })
        }
      } catch (error) {
        console.error("Failed to generate AI prompt:", error)
        // Silently fail - still show form without AI prompt
        setAiPrompt(null)
      } finally {
        setPromptLoading(false)
      }
    }, 1000) // 1 second debounce

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [title])

  // Handles journal entry submission
  const handleSubmit = async () => {
    // Validate inputs
    if (!user || !title.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setIsSubmitting(true)
    try {
      // Save journal entry to database
      await addJournalEntry(user.id, title, content, selectedMood || undefined)
      toast.success("Journal entry saved!")
      // Reset form
      setTitle("")
      setContent("")
      setSelectedMood(null)
      setIsOpen(false)
      // Notify parent to refresh
      onUpdate()
    } catch (error) {
      toast.error("Failed to save journal entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handles deleting a journal entry
  const handleDelete = async (entryId: string) => {
    setDeleteLoading(entryId)
    try {
      await deleteJournalEntry(entryId)
      toast.success("Journal entry deleted")
      setDeleteConfirmId(null)
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete entry")
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      {/* Card header with entry count and new entry button */}
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
          {/* New entry dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            {/* New entry dialog content */}
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
                <DialogDescription>
                  Write about your thoughts, feelings, or experiences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* AI-Powered Inspirational Prompt */}
                {aiPrompt ? (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/5 border border-purple-300/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-1">{aiPrompt.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          AI-Powered Reflection
                          <Sparkles className="w-3 h-3 text-purple-500" />
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{aiPrompt.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-2 italic">{aiPrompt.followUp}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Loading state for prompt
                  promptLoading && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/30 space-y-2 animate-pulse">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Generating personalized prompt...</p>
                      </div>
                    </div>
                  )
                )}
                
                {/* Entry title input */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">What would you like to journal about?</p>
                  <Input
                    placeholder="Give your entry a title (e.g., 'Helped a friend today', 'Grateful moments')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-input border-border"
                  />
                  {title.length > 0 && title.length < 3 && (
                    <p className="text-xs text-muted-foreground mt-1">Keep typing to get AI-powered prompts...</p>
                  )}
                </div>
                
                {/* Entry content textarea */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Share your thoughts</p>
                  <Textarea
                    placeholder="Write your thoughts and feelings... The AI prompt above is just a guide—feel free to write anything on your mind."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] resize-none bg-input border-border"
                  />
                </div>
                {/* Mood selection */}
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
                {/* Submit button */}
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
        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12 px-4">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No journal entries yet. Start reflecting!</p>
          </div>
        ) : (
          /* Scrollable list of entries */
          <ScrollArea className="h-[350px]">
            <div className="p-4 space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Entry content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Mood emoji if associated */}
                        {entry.mood && (
                          <span className="text-lg">
                            {moodOptions.find((m) => m.value === entry.mood)?.emoji}
                          </span>
                        )}
                        <h4 className="font-medium text-foreground truncate">{entry.title}</h4>
                      </div>
                      {/* Entry preview */}
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      {/* Creation date */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {entry.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    {/* Delete button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteConfirmId(entry.id)}
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLoading !== null}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
