"use client"

import { getDailyQuote } from "@/lib/quotes"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function DailyQuote() {
  const quote = getDailyQuote()

  return (
    <Card className="shadow-lg border-border/50 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Quote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium leading-relaxed italic">
              "{quote.quote}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">- {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
