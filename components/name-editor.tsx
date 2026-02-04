"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User, AlertCircle } from "lucide-react"

interface NameEditorProps {
  currentName?: string
  onSave: (name: string) => Promise<void>
  loading?: boolean
}

export function NameEditor({ currentName = "", onSave, loading = false }: NameEditorProps) {
  const [name, setName] = useState(currentName)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateName = (value: string): boolean => {
    const newErrors: string[] = []

    if (!value || value.trim().length === 0) {
      newErrors.push("Name cannot be empty")
    }

    if (value.length > 50) {
      newErrors.push("Name must be less than 50 characters")
    }

    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      newErrors.push("Name can only contain letters, spaces, hyphens, and apostrophes")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSave = async () => {
    if (!validateName(name)) return

    setIsSaving(true)
    try {
      await onSave(name)
      setIsEditing(false)
      toast.success("Name updated successfully!")
    } catch (error) {
      toast.error("Failed to update name")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setName(currentName)
    setIsEditing(false)
    setErrors([])
  }

  if (!isEditing) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Display Name
          </CardTitle>
          <CardDescription>This name appears across your profile and activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Name</p>
            <p className="text-lg font-semibold">{currentName || "No name set"}</p>
          </div>
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Edit Name
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Edit Display Name
        </CardTitle>
        <CardDescription>Update how your name appears in the app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Your Name</Label>
          <Input
            id="display-name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSaving}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">{name.length}/50 characters</p>
        </div>

        {errors.length > 0 && (
          <div className="space-y-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            {errors.map((error, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
