"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User, AlertCircle } from "lucide-react"

// Props interface for the NameEditor component
interface NameEditorProps {
  currentName?: string // The user's current display name
  onSave: (name: string) => Promise<void> // Callback function to save the name
  loading?: boolean // Loading state indicator
}

// NameEditor component - handles editing and saving the user's display name
export function NameEditor({ currentName = "", onSave, loading = false }: NameEditorProps) {
  // State management
  const [name, setName] = useState(currentName) // Current name being edited
  const [isSaving, setIsSaving] = useState(false) // Tracks if the name is being saved
  const [isEditing, setIsEditing] = useState(false) // Tracks if the component is in edit mode
  const [errors, setErrors] = useState<string[]>([]) // Array of validation errors

  // Validates the name input against multiple criteria
  const validateName = (value: string): boolean => {
    const newErrors: string[] = []

    // Check if name is empty
    if (!value || value.trim().length === 0) {
      newErrors.push("Name cannot be empty")
    }

    // Check if name exceeds character limit
    if (value.length > 50) {
      newErrors.push("Name must be less than 50 characters")
    }

    // Check if name contains only allowed characters
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      newErrors.push("Name can only contain letters, spaces, hyphens, and apostrophes")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  // Handles saving the new name after validation
  const handleSave = async () => {
    // Validate the name before saving
    if (!validateName(name)) return

    setIsSaving(true)
    try {
      // Call the parent component's onSave callback with the new name
      await onSave(name)
      setIsEditing(false)
      toast.success("Name updated successfully!")
    } catch (error) {
      // Handle save errors gracefully
      toast.error("Failed to update name")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handles canceling the edit - resets to original name and exits edit mode
  const handleCancel = () => {
    setName(currentName)
    setIsEditing(false)
    setErrors([])
  }

  // View mode - displays the current name with an edit button
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
          {/* Display the current name in a highlighted box */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Name</p>
            <p className="text-lg font-semibold">{currentName || "No name set"}</p>
          </div>
          {/* Button to switch to edit mode */}
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Edit Name
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Edit mode - displays the input field and save/cancel buttons
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
        {/* Input field for the name */}
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
          {/* Character counter */}
          <p className="text-xs text-muted-foreground">{name.length}/50 characters</p>
        </div>

        {/* Error display section - shown when validation errors exist */}
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

        {/* Save and Cancel buttons */}
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
