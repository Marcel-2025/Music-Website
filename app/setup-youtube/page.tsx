"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, Search, Youtube } from "lucide-react"
import Link from "next/link"

interface SetupStatus {
  youtube: {
    apiKeyConfigured: boolean
    channelIdConfigured: boolean
    allConfigured: boolean
    channelId: string | null
  }
}

interface ChannelResult {
  id: string
  title: string
  description: string
  thumbnail: string
}

export default function SetupYoutubePage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChannelResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)

  const fetchSetupStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-check")
      const data: SetupStatus = await response.json()
      setStatus(data)
      setSelectedChannelId(data.youtube.channelId) // Pre-fill if already configured
    } catch (error) {
      console.error("Failed to fetch setup status:", error)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSetupStatus()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery) return
    setSearchLoading(true)
    setSearchError(null)
    try {
      const response = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.channels)
      } else {
        setSearchError(data.error || "Failed to search channels.")
      }
    } catch (error) {
      setSearchError("An error occurred during search.")
      console.error("Search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSaveChannelId = async () => {
    if (!selectedChannelId) return
    // In a real application, you would save this to your database or a persistent store.
    // For this demo, we'll just update the local state and simulate success.
    alert(
      `YouTube Channel ID saved: ${selectedChannelId}. Please update your Vercel environment variable YOUTUBE_CHANNEL_ID.`,
    )
    await fetchSetupStatus() // Re-fetch status to reflect potential changes
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-white ml-4">Loading setup status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" /> YouTube Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="youtube-api-key-status" className="text-lg">
              YouTube API Key (YOUTUBE_API_KEY)
            </Label>
            {status?.youtube.apiKeyConfigured ? (
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" /> Configured
              </span>
            ) : (
              <span className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" /> Not Configured
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="youtube-channel-id" className="text-lg">
              YouTube Channel ID (YOUTUBE_CHANNEL_ID)
            </Label>
            <div className="flex gap-2">
              <Input
                id="youtube-channel-id"
                placeholder="Enter YouTube Channel ID or search below"
                value={selectedChannelId || ""}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button
                onClick={handleSaveChannelId}
                disabled={!selectedChannelId}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save ID
              </Button>
            </div>
            {status?.youtube.channelIdConfigured ? (
              <p className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Channel ID is configured.
              </p>
            ) : (
              <p className="flex items-center text-red-400 text-sm">
                <XCircle className="w-4 h-4 mr-1" /> Channel ID is not configured. Please set it in Vercel.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="channel-search" className="text-lg">
              Search YouTube Channel
            </Label>
            <div className="flex gap-2">
              <Input
                id="channel-search"
                placeholder="Search by channel name or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={!status?.youtube.apiKeyConfigured}
              />
              <Button
                onClick={handleSearch}
                disabled={searchLoading || !status?.youtube.apiKeyConfigured}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="ml-2">Search</span>
              </Button>
            </div>
            {!status?.youtube.apiKeyConfigured && (
              <p className="text-red-400 text-sm">Please configure `YOUTUBE_API_KEY` to enable channel search.</p>
            )}
            {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                {searchResults.map((channel) => (
                  <Card
                    key={channel.id}
                    className="bg-gray-700 border-gray-600 flex items-center p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    <img
                      src={channel.thumbnail || "/placeholder.svg"}
                      alt={channel.title}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-white">{channel.title}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{channel.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
            {status?.youtube.allConfigured ? (
              <span className="flex items-center text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> YouTube is fully configured!
              </span>
            ) : (
              <span className="flex items-center text-red-400 font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> YouTube setup incomplete.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
