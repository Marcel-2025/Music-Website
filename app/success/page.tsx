"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const [spotifyData, setSpotifyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testSpotifyConnection()
  }, [])

  const testSpotifyConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/spotify")
      const data = await response.json()
      setSpotifyData(data)
    } catch (error) {
      console.error("Failed to test connection:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800/50 rounded-lg shadow-lg max-w-md mx-auto border border-gray-700">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Setup Complete!</h1>
        <p className="text-lg text-gray-300 mb-6">
          Your music portfolio app is now configured and ready to display your releases.
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-3">
            <Link href="/">View Your Live App</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg py-3 bg-transparent"
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
