"use client"

import { useState, useEffect } from "react"
import { moodOptions, type MoodEntry } from "@/lib/data"
import { getMusicForMood, getYouTubeSearchUrl } from "@/lib/music-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, ExternalLink, Sparkles, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AIMusicSuggestion } from "@/lib/music-ai-service"

interface MusicSuggestionsProps {
  recentMood: MoodEntry | null
}

export function MusicSuggestions({ recentMood }: MusicSuggestionsProps) {
  const mood = recentMood?.mood || "neutral"
  const moodInfo = moodOptions.find((m) => m.value === mood)
  const [suggestions, setSuggestions] = useState<AIMusicSuggestion[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load AI suggestions on mount or when mood changes
  useEffect(() => {
    if (recentMood) {
      generateAIMusicSuggestions()
    }
  }, [mood, recentMood])

  // Generate music suggestions using AI
  const generateAIMusicSuggestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: moodInfo?.label || mood,
          context: recentMood?.note || '',
          count: 5,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate music suggestions')
      }

      const data = await response.json()

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions)
      } else {
        toast.error(data.error || 'Failed to generate music suggestions')
      }
    } catch (error) {
      console.error('Error generating AI music suggestions:', error)
      toast.error('Failed to generate music suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  // Display only AI suggestions
  const displaySuggestions = suggestions || []

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-chart-2/10 flex items-center justify-center">
              <Music className="w-4 h-4 text-chart-2" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">Music for Your Mood</CardTitle>
              <CardDescription className="text-xs">
                Based on feeling {moodInfo?.emoji} {moodInfo?.label}
                {suggestions && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    AI Powered
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          {suggestions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAIMusicSuggestions}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Generating suggestions...</span>
            </div>
          ) : displaySuggestions.length > 0 ? (
            displaySuggestions.map((song, index) => (
              <a
                key={index}
                href={getYouTubeSearchUrl(song.title, song.artist)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                    {song.reason && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{song.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted whitespace-nowrap">
                      {song.genre}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Log a mood to get AI-powered music suggestions</p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateAIMusicSuggestions}
                className="w-full mt-3"
                disabled={isLoading || !recentMood}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Suggestions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
