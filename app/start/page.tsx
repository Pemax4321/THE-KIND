"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function StartPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/select-role")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const features = [
    {
      title: "Daily Inspiration",
      description: "Get personalized kindness ideas and gentle reminders to spread positivity every day"
    },
    {
      title: "Track & Celebrate",
      description: "Log your acts of kindness and watch your impact grow with meaningful insights"
    },
    {
      title: "Mood Tracking",
      description: "Connect your daily mood with kindness activities and discover what makes you happiest"
    },
    {
      title: "Journal Reflections",
      description: "Share your kindness stories and reflect on the moments that matter most"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Small Acts.
            <br />
            Real Impact.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build positive habits and make kindness part of your daily life. THE KIND helps you discover meaningful ways to give back and track the positive change you're creating in your community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:bg-card/80 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Start Your Journey
          </Button>

          <div className="pt-2">
            <button
              onClick={handleLogin}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 underline underline-offset-4"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
