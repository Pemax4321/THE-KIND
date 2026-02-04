"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getRandomKindnessIdeaWithCustom, addKindnessAct, type CustomKindnessIdea, kindnessIdeas } from "@/lib/data"
import { getCategoryColor } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Sparkles, RefreshCw, Plus, Loader2 } from "lucide-react"

interface KindnessGeneratorProps {
  onActAdded: () => void
  customIdeas?: CustomKindnessIdea[]
}

export function KindnessGenerator({ onActAdded, customIdeas = [] }: KindnessGeneratorProps) {
  const { user } = useAuth()
  const [currentIdea, setCurrentIdea] = useState(() => kindnessIdeas[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setCurrentIdea(getRandomKindnessIdeaWithCustom(customIdeas))
  }, [customIdeas])

  const generateNewIdea = () => {
    setIsSpinning(true)
    setTimeout(() => {
      setCurrentIdea(getRandomKindnessIdeaWithCustom(customIdeas))
      setIsSpinning(false)
    }, 500)
  }

  const handleAddToList = async () => {
    if (!user) return
    setIsAdding(true)
    try {
      await addKindnessAct(user.id, currentIdea.description, currentIdea.category)
      toast.success("Kindness act added to your list!")
      onActAdded()
      generateNewIdea()
    } catch (error) {
      toast.error("Failed to add kindness act")
    } finally {
      setIsAdding(false)
    }
  }

  const getCategoryColorClass = (category: string) => {
    return getCategoryColor(category)
  }

  return (
    <Card className="shadow-lg border-border/50 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Random Kindness Generator</CardTitle>
            <CardDescription>Discover a new way to spread kindness today</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="min-h-[100px] flex flex-col justify-center">
            <Badge variant="outline" className={`mb-3 w-fit ${getCategoryColorClass(currentIdea.category)}`}>
              {currentIdea.category}
            </Badge>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentIdea.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={generateNewIdea}
              disabled={isSpinning}
              className="flex-1 min-w-[140px] bg-transparent"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
              New Idea
            </Button>
            <Button
              onClick={handleAddToList}
              disabled={isAdding}
              className="flex-1 min-w-[140px]"
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
