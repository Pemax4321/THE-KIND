// Custom Kindness Ideas component - manages user-created kindness ideas
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  addCustomKindnessIdea,
  deleteCustomKindnessIdea,
  completeCustomKindnessIdea,
  type CustomKindnessIdea,
} from "@/lib/data"
import { KINDNESS_CATEGORIES, getCategoryColor } from "@/lib/categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Lightbulb, Plus, Trash2, Loader2, CheckCircle2, Circle } from "lucide-react"

// Props interface for CustomKindnessIdeas
interface CustomKindnessIdeasProps {
  ideas: CustomKindnessIdea[] // Array of custom ideas to display
  onUpdate: () => void // Callback to refresh data after changes
  loading: boolean // Loading state indicator
}

// CustomKindnessIdeas component - allows users to create and manage custom ideas
export function CustomKindnessIdeas({ ideas, onUpdate, loading }: CustomKindnessIdeasProps) {
  // Get user from auth context
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [description, setDescription] = useState("") // Idea description
  const [category, setCategory] = useState<string>("") // Selected category
  const [isSubmitting, setIsSubmitting] = useState(false) // Submission loading state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null) // Deletion loading state
  const [completeLoading, setCompleteLoading] = useState<string | null>(null) // Completion loading state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null) // Delete confirmation state

  // Handles adding a new custom idea
  const handleSubmit = async () => {
    // Validate inputs
    if (!user || !description.trim() || !category) {
      toast.error("Please fill in all fields")
      return
    }
    setIsSubmitting(true)
    try {
      // Save custom idea to database
      await addCustomKindnessIdea(user.id, description.trim(), category)
      toast.success("Custom kindness idea saved!")
      // Reset form
      setDescription("")
      setCategory("")
      setIsOpen(false)
      // Notify parent to refresh
      onUpdate()
    } catch (error) {
      toast.error("Failed to save custom idea")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handles completing a custom idea
  const handleComplete = async (ideaId: string) => {
    setCompleteLoading(ideaId)
    try {
      await completeCustomKindnessIdea(ideaId)
      toast.success("Great! Task marked as completed. Added to your acts and streak!")
      onUpdate()
    } catch (error) {
      toast.error("Failed to complete idea")
    } finally {
      setCompleteLoading(null)
    }
  }

  // Handles deleting a custom idea
  const handleDelete = async (ideaId: string) => {
    setDeleteLoading(ideaId)
    try {
      await deleteCustomKindnessIdea(ideaId)
      toast.success("Custom idea removed")
      setDeleteConfirmId(null)
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete idea")
    } finally {
      setDeleteLoading(null)
    }
  }

  // Helper function to get category color classes
  const getCategoryColorClass = (cat: string) => {
    return getCategoryColor(cat)
  }

  return (
    <Card className="shadow-lg border-border/50">
      {/* Card header with idea count and add button */}
      <CardHeader className="bg-chart-4/10 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-chart-4/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">My Custom Ideas</CardTitle>
              <CardDescription>{ideas.length} saved ideas</CardDescription>
            </div>
          </div>
          {/* Add idea dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Idea
              </Button>
            </DialogTrigger>
            {/* Dialog content for adding new idea */}
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add Custom Kindness Idea</DialogTitle>
                <DialogDescription>
                  Create your own kindness idea to include in the generator.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Idea description input */}
                <div>
                  <label htmlFor="description" className="text-sm font-medium text-foreground mb-1.5 block">
                    Kindness Idea
                  </label>
                  <Input
                    id="description"
                    placeholder="Describe your kindness act..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                {/* Category selection */}
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-foreground mb-1.5 block">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {KINDNESS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Submit button */}
                <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Idea"
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
        ) : ideas.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12 px-4">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No custom ideas yet. Add your own!</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Your ideas will appear in the random generator.
            </p>
          </div>
        ) : (
          /* Scrollable list of ideas */
          <ScrollArea className="h-[250px]">
            <div className="p-4 space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    idea.completed
                      ? "border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-border/50 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Idea content */}
                    <div className="flex-1 min-w-0">
                      {/* Category badge */}
                      <Badge
                        variant="outline"
                        className={`mb-2 text-xs ${
                          idea.completed ? "opacity-60" : ""
                        } ${getCategoryColorClass(idea.category)}`}
                      >
                        {idea.category}
                      </Badge>
                      {/* Idea description */}
                      <p
                        className={`text-sm ${
                          idea.completed ? "line-through text-muted-foreground/60" : "text-foreground"
                        }`}
                      >
                        {idea.description}
                      </p>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Complete/Tick button */}
                      {!idea.completed && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleComplete(idea.id)}
                          disabled={completeLoading === idea.id}
                          title="Mark as completed"
                        >
                          {completeLoading === idea.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="sr-only">Mark as completed</span>
                        </Button>
                      )}
                      {/* Completed checkmark indicator */}
                      {idea.completed && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      )}
                      {/* Delete button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirmId(idea.id)}
                        disabled={deleteLoading === idea.id}
                      >
                        {deleteLoading === idea.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
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
            <AlertDialogTitle>Delete idea?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this kindness idea? This action cannot be undone.
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
