"use client"

import { moodOptions, type MoodEntry } from "@/lib/data"
import { getMusicForMood, getYouTubeSearchUrl } from "@/lib/music-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ExternalLink } from "lucide-react"

interface MusicSuggestionsProps {
  recentMood: MoodEntry | null
}

export function MusicSuggestions({ recentMood }: MusicSuggestionsProps) {
  const mood = recentMood?.mood || "neutral"
  const moodInfo = moodOptions.find((m) => m.value === mood)
  const suggestions = getMusicForMood(mood)

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-chart-2/10 flex items-center justify-center">
            <Music className="w-4 h-4 text-chart-2" />
          </div>
          <div>
            <CardTitle className="text-base text-foreground">Music for Your Mood</CardTitle>
            <CardDescription className="text-xs">
              Based on feeling {moodInfo?.emoji} {moodInfo?.label}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {suggestions.map((song, index) => (
            <a
              key={index}
              href={getYouTubeSearchUrl(song.title, song.artist)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                  {song.genre}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
