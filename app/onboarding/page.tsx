"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Sparkles, TrendingUp, BookOpen, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSkipping, setIsSkipping] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/start")
    }
  }, [user, loading, router])

  const steps = [
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Welcome to THE KIND",
      description: "You're now part of a community dedicated to spreading kindness. Ready to make a positive impact?",
      details: [
        "✨ Get personalized kindness ideas daily",
        "📊 Track your acts of kindness",
        "😊 Connect mood with your growth"
      ]
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      title: "Generate Kindness Ideas",
      description: "Stuck on how to be kind? Our AI generates personalized suggestions tailored to your interests and mood.",
      details: [
        "🎯 Ideas based on your role (Student, Professional, Parent, etc.)",
        "💡 Fresh ideas every day",
        "⏱️ From quick micro-acts to meaningful projects"
      ]
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Track Your Impact",
      description: "Log each kind act and watch your kindness journey unfold with meaningful insights and statistics.",
      details: [
        "📈 See your kindness grow over time",
        "🎯 Achieve milestones and badges",
        "💪 Build consistent habits"
      ]
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Reflect & Share",
      description: "Journal about your kindness moments, connect your mood, and understand what makes you happiest.",
      details: [
        "📝 Journal your kindness stories",
        "😌 Track mood changes",
        "🔗 See the connection between giving and happiness"
      ]
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSkipping(true)
    // Small delay for better UX
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  const handleSkip = async () => {
    setIsSkipping(true)
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={handleSkip}
              disabled={isSkipping}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip Guide
            </button>
          </div>
          <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-6 pt-12">
            <div className="flex justify-center">{step.icon}</div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold text-foreground">
                {step.title}
              </CardTitle>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                {step.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pb-12">
            {/* Details List */}
            <div className="space-y-3">
              {step.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary/70 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center pt-4">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isSkipping}
                  className="px-6"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isSkipping}
                className="px-6"
              >
                {isSkipping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun fact/tip */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium text-foreground">Did you know?</span> Research shows that acts of kindness boost both your happiness and the recipient's wellbeing.
          </p>
        </div>
      </div>
    </div>
  )
}
