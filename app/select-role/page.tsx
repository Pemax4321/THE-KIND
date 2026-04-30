"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, User, ArrowRight } from "lucide-react"

type UserRole = "student" | "lecturer" | "general"

interface RoleOption {
  id: UserRole
  title: string
  description: string
  icon: React.ReactNode
}

const roles: RoleOption[] = [
  {
    id: "student",
    title: "Student",
    description: "Academic kindness and peer support",
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    id: "lecturer",
    title: "Lecturer / Teacher",
    description: "Mentor and guide your students",
    icon: <Users className="w-8 h-8" />,
  },
  {
    id: "general",
    title: "General User",
    description: "Community and everyday kindness",
    icon: <User className="w-8 h-8" />,
  },
]

export default function SelectRolePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    if (!selectedRole) return
    setIsLoading(true)
    localStorage.setItem("selectedRole", selectedRole)
    router.push("/signup")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 py-12">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Tell us about yourself</h1>
          <p className="text-lg text-muted-foreground">
            So we can personalise your kindness journey.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="h-full transition-all duration-200 ease-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            >
              <Card
                className={`h-full cursor-pointer border-2 transition-all duration-200 ${
                  selectedRole === role.id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        selectedRole === role.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {role.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => handleContinue()}
            disabled={!selectedRole || isLoading}
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {isLoading ? "Loading..." : "Continue"}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
