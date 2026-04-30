// Utility functions for styling and formatting
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combines class names intelligently, merging Tailwind classes and removing conflicts
// Uses clsx for conditional classes and tailwind-merge to handle Tailwind conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
