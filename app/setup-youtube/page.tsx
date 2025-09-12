"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, Search, Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Channel {
  id: string
  name: string
  description: string
  image: string | null
  youtubeUrl: string
}

export default function SetupYoutubePage() {
  const [apiKey, setApiKey] = useState("")
  const [channelId, setChannelId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [currentConfig, setCurrentConfig] = useState<{ apiKey: boolean; channelId: boolean }>({
    apiKey: false,
    channelId: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    checkCurrentConfig()
  }, [])

  const checkCurrentConfig = async () => {
    const res = await fetch("/api/setup-check")
    const data = await res.json()
    setCurrentConfig({
      apiKey: data.youtube.apiKey,
      channelId: data.youtube.channelId,
    })
  }

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Search Error",
        description: "Please enter a channel name or ID to search.",
        type: "error",
      })
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.channels)
      } else {
        toast({
          title: "Search Failed",
          description: data.error || "Could not search for channels. Check your API Key.",
          type: "error",
        })
        setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "An unexpected error occurred during search.",
        type: "error",
      })
    } finally {
      setSearchLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      // Temporarily set environment variables for the test if provided
      const testParams = new URLSearchParams()
      if (apiKey) testParams.append("YOUTUBE_API_KEY", apiKey)
      if (channelId) testParams.append("YOUTUBE_CHANNEL_ID", channelId)

      const res = await fetch(`/api/youtube?${testParams.toString()}`)
      const data = await res.json()

      if (data.success) {
        setStatus("success")
        toast({
          title: "Connection Successful!",
          description: `Connected to YouTube channel: ${data.channel.name}`,
          type: "success",
        })
      } else {
        setStatus("error")
        toast({
          title: "Connection Failed",
          description: data.error || "Please check your API Key and Channel ID.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Test connection error:", error)
      setStatus("error")
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred during connection test.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">YouTube Integration Setup</h1>
          <p className="text-gray-300">Configure your YouTube API Key and Channel ID to fetch live data.</p>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">1. Enter YouTube API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You can get your API Key from the Google Cloud Console. Make sure the YouTube Data API v3 is enabled.
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="apiKey" className="sr-only">
                  YouTube API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your YouTube API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                {currentConfig.apiKey ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Note: For production, set this as `YOUTUBE_API_KEY` environment variable in Vercel.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">2. Find Your YouTube Channel ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You can find your Channel ID in your YouTube Advanced Settings or by searching below.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search channel by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleSearch}
                  disabled={searchLoading || !apiKey}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="sr-only">Search</span>
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                  {searchResults.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        setChannelId(channel.id)
                        setSearchQuery(channel.name) // Set search query to channel name for better UX
                        setSearchResults([]) // Clear search results after selection
                      }}
                    >
                      {channel.image && (
                        <Image
                          src={channel.image || "/placeholder.svg"}
                          alt={channel.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-white">{channel.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{channel.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto text-red-400 border-red-400 hover:bg-red-900/20 bg-transparent"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Label htmlFor="channelId" className="sr-only">
                  YouTube Channel ID
                </Label>
                <Input
                  id="channelId"
                  placeholder="Your YouTube Channel ID"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                {currentConfig.channelId ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Note: For production, set this as `YOUTUBE_CHANNEL_ID` environment variable in Vercel.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleTestConnection}
            disabled={loading || !apiKey || !channelId}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Test Connection
          </Button>
        </div>

        {status === "success" && (
          <Card className="bg-green-900/20 border-green-500/30 mb-8">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-300 mb-2">YouTube Connected Successfully!</h3>
              <p className="text-green-200 mb-4">Your YouTube data should now appear on the dashboard.</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="bg-red-900/20 border-red-500/30 mb-8">
            <CardContent className="p-6 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-300 mb-2">Connection Failed</h3>
              <p className="text-red-200 mb-4">Please review your API Key and Channel ID and try again.</p>
              <Button onClick={handleTestConnection} className="bg-red-600 hover:bg-red-700">
                Retry Connection
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link href="/dashboard" className="text-gray-400 hover:underline text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
