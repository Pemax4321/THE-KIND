"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getMoodEntries, type MoodEntry } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Heart, 
  Smile, 
  Music, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  AlertCircle
} from "lucide-react"

interface FlowStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'in-progress' | 'completed'
  action: string
}

interface WorkflowGuideProps {
  onNavigate?: (tab: string) => void
}

export function WorkflowGuide({ onNavigate }: WorkflowGuideProps) {
  const { user } = useAuth()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMoods = async () => {
      if (!user?.id) return
      try {
        const moods = await getMoodEntries(user.id)
        setMoodEntries(moods)
      } catch (error) {
        console.error('Error fetching moods:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMoods()
  }, [user?.id])

  // Determine step statuses based on data
  const getTodaysMood = () => {
    if (!moodEntries.length) return null
    const today = new Date().toDateString()
    return moodEntries.find(entry => new Date(entry.createdAt).toDateString() === today)
  }

  const todaysMood = getTodaysMood()

  const steps: FlowStep[] = [
    {
      id: 'mood',
      title: 'Log Your Mood',
      description: 'Start by logging how you\'re feeling today with optional notes',
      icon: <Smile className="w-6 h-6" />,
      status: todaysMood ? 'completed' : 'pending',
      action: 'Log Mood'
    },
    {
      id: 'music',
      title: 'Get Music Suggestions',
      description: 'Receive personalized music recommendations based on your mood',
      icon: <Music className="w-6 h-6" />,
      status: todaysMood ? 'in-progress' : 'pending',
      action: 'View Music'
    },
    {
      id: 'kindness',
      title: 'Generate Kindness Ideas',
      description: 'Get personalized kindness act suggestions powered by AI',
      icon: <Lightbulb className="w-6 h-6" />,
      status: todaysMood ? 'in-progress' : 'pending',
      action: 'Generate Ideas'
    },
    {
      id: 'action',
      title: 'Take Action',
      description: 'Add kindness acts to your list and track your progress',
      icon: <CheckCircle2 className="w-6 h-6" />,
      status: 'pending',
      action: 'View List'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-400 dark:text-gray-500'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Your Daily Kindness Journey
        </h2>
        <p className="text-muted-foreground">
          Follow these steps to spread kindness, improve your mood, and make a difference
        </p>
      </div>

      {/* Progress Alert */}
      {todaysMood && (
        <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            Great! You've logged your mood today. Now explore music suggestions and generate kindness ideas.
          </AlertDescription>
        </Alert>
      )}

      {!todaysMood && (
        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            Start your journey by logging your current mood. This helps personalize your experience.
          </AlertDescription>
        </Alert>
      )}

      {/* Workflow Steps */}
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`border-2 transition-all hover:shadow-md ${getStatusBgColor(step.status)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(step.status)} bg-background border`}>
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      {step.status === 'completed' && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">
                          Done
                        </span>
                      )}
                      {step.status === 'in-progress' && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) {
                      if (step.id === 'mood') onNavigate('workflow')
                      else if (step.id === 'music') onNavigate('insights')
                      else if (step.id === 'kindness') onNavigate('kindness')
                      else if (step.id === 'action') onNavigate('kindness')
                    }
                  }}
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>

            {/* Step Number */}
            <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground opacity-50">
              Step {index + 1} of {steps.length}
            </div>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
            <Heart className="w-5 h-5" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
          <p>✨ Log your mood daily to get better personalized recommendations</p>
          <p>🎵 Use the music suggestions to set a positive emotional tone</p>
          <p>💡 Generate new kindness ideas whenever you need inspiration</p>
          <p>✅ Add acts to your list to track your kindness journey</p>
        </CardContent>
      </Card>
    </div>
  )
}
