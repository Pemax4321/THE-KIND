// Root layout component that wraps the entire application
import React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// Import and configure the Plus Jakarta Sans font from Google Fonts
const _plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

// Application metadata - defines SEO and browser metadata
export const metadata: Metadata = {
  title: "THE KIND - Random Kindness Generator",
  description: "A mental well-being app that encourages daily acts of kindness, mood tracking, and reflection journaling for students.",
  generator: "v0.app",
  // Define light/dark mode favicons
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

// Main layout component that renders all child components
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* AuthProvider: Wraps the app to provide authentication context */}
        <AuthProvider>
          {children}
          {/* Toaster: Component for displaying toast notifications */}
          <Toaster />
        </AuthProvider>
        {/* Analytics: Tracks user interactions and page performance */}
        <Analytics />
      </body>
    </html>
  )
}
