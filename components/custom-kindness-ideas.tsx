"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  addCustomKindnessIdea,
  deleteCustomKindnessIdea,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Lightbulb, Plus, Trash2, Loader2 } from "lucide-react"

interface CustomKindnessIdeasProps {
  ideas: CustomKindnessIdea[]
  onUpdate: () => void
  loading: boolean
}

export function CustomKindnessIdeas({ ideas, onUpdate, loading }: CustomKindnessIdeasProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!user || !description.trim() || !category) {
      toast.error("Please fill in all fields")
      return
    }
    setIsSubmitting(true)
    try {
      await addCustomKindnessIdea(user.id, description.trim(), category)
      toast.success("Custom kindness idea saved!")
      setDescription("")
      setCategory("")
      setIsOpen(false)
      onUpdate()
    } catch (error) {
      toast.error("Failed to save custom idea")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (ideaId: string) => {
    setDeleteLoading(ideaId)
    try {
      await deleteCustomKindnessIdea(ideaId)
      toast.success("Custom idea removed")
      onUpdate()
    } catch (error) {
      toast.error("Failed to delete idea")
    } finally {
      setDeleteLoading(null)
    }
  }

  const getCategoryColorClass = (cat: string) => {
    return getCategoryColor(cat)
  }

  return (
    <Card className="shadow-lg border-border/50">
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add Custom Kindness Idea</DialogTitle>
                <DialogDescription>
                  Create your own kindness idea to include in the generator.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No custom ideas yet. Add your own!</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Your ideas will appear in the random generator.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[250px]">
            <div className="p-4 space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className={`mb-2 text-xs ${getCategoryColorClass(idea.category)}`}>
                        {idea.category}
                      </Badge>
                      <p className="text-sm text-foreground">{idea.description}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(idea.id)}
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
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
