// Kindness Generator component - generates random kindness ideas using AI
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { addKindnessAct, type CustomKindnessIdea } from "@/lib/data"
import { getCategoryColor } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Sparkles, RefreshCw, Plus, Loader2 } from "lucide-react"

// Props interface for KindnessGenerator
interface KindnessGeneratorProps {
  onActAdded: () => void // Callback when a kindness act is added
  customIdeas?: CustomKindnessIdea[] // Optional array of custom ideas
}

interface KindnessIdea {
  description: string
  category: string
  source?: 'ai'
}

// KindnessGenerator component - AI-powered kindness ideas
export function KindnessGenerator({ onActAdded, customIdeas = [] }: KindnessGeneratorProps) {
  // Get user and user role from auth context
  const { user, userRole } = useAuth()
  const [currentIdea, setCurrentIdea] = useState<KindnessIdea>({
    description: "Loading your first kindness idea...",
    category: "Loading",
  })
  const [isLoading, setIsLoading] = useState(true) // Tracks if idea is being loaded
  const [isAdding, setIsAdding] = useState(false) // Tracks if idea is being added
  const [previousIdeas, setPreviousIdeas] = useState<string[]>([]) // Track previous ideas to avoid duplicates

  // Load initial idea when component mounts
  useEffect(() => {
    generateAIIdea()
  }, [userRole])

  // Generate a new idea using AI
  const generateAIIdea = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-kindness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRole: userRole || 'general',
          previousIdeas: previousIdeas.slice(0, 15), // Send last 15 ideas to avoid duplicates
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate idea')
      }

      const data = await response.json()

      if (data.success && data.idea) {
        const newIdea: KindnessIdea = {
          description: data.idea.description,
          category: data.idea.category,
          source: 'ai',
        }
        setCurrentIdea(newIdea)
        
        // Track previous ideas to avoid duplicates
        setPreviousIdeas(prev => [newIdea.description, ...prev].slice(0, 25))
      } else {
        toast.error(data.error || 'Failed to generate idea')
      }
    } catch (error) {
      console.error('Error generating AI idea:', error)
      toast.error('Failed to generate kindness idea. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Add current idea to user's kindness acts list
  const handleAddToList = async () => {
    if (!user) {
      toast.error("Please log in to add kindness acts")
      return
    }
    setIsAdding(true)
    try {
      // Save kindness act to database
      const result = await addKindnessAct(user.id, currentIdea.description, currentIdea.category)
      if (result) {
        toast.success("Kindness act added to your list!")
        // Notify parent component
        onActAdded()
        // Generate new idea for continued use
        await generateAIIdea()
      } else {
        throw new Error('No ID returned from database')
      }
    } catch (error) {
      console.error("Error adding kindness act:", error)
      toast.error(`Failed to add kindness act: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAdding(false)
    }
  }

  // Helper function to get category color classes
  const getCategoryColorClass = (category: string) => {
    return getCategoryColor(category)
  }

  return (
    <Card className="shadow-lg border-border/50 overflow-hidden">
      {/* Card header with icon and title */}
      <CardHeader className="bg-primary/5 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">
              AI Kindness Generator
            </CardTitle>
            <CardDescription>Powered by OpenAI - Unlimited ideas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Kindness idea display area */}
          <div className="min-h-[120px] flex flex-col justify-center">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={`${getCategoryColorClass(currentIdea.category)}`}>
                {currentIdea.category}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                AI Generated
              </Badge>
            </div>
            {/* Kindness idea text */}
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentIdea.description}
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {/* Generate new idea button */}
            <Button
              variant="outline"
              onClick={generateAIIdea}
              disabled={isLoading}
              className="w-full bg-transparent"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Generating..." : "Generate New Idea"}
            </Button>

            {/* Add to list button */}
            <Button
              onClick={handleAddToList}
              disabled={isAdding}
              className="w-full"
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add to My List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
