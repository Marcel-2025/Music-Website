"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Youtube, Search, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Channel {
  id: string
  name: string
  description: string
  image: string
}

export default function SetupYoutubePage() {
  // These states are for user input/display, not directly tied to process.env
  const [apiKeyInput, setApiKeyInput] = useState("") // This input is just for display/guidance, not used directly for API calls
  const [channelIdInput, setChannelIdInput] = useState("") // For user to select/input channel ID

  // These states reflect the configuration status fetched from the server
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false)
  const [isChannelIdConfigured, setIsChannelIdConfigured] = useState(false)

  const [testResult, setTestResult] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Channel[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [channelData, setChannelData] = useState<any>(null)

  // Fetch initial configuration status on mount
  useEffect(() => {
    const fetchConfigStatus = async () => {
      try {
        const response = await fetch("/api/setup-check")
        const data = await response.json()
        if (data.youtube) {
          setIsApiKeyConfigured(data.youtube.apiKeyConfigured)
          setIsChannelIdConfigured(data.youtube.channelIdConfigured)
          if (data.youtube.channelIdValue) {
            setChannelIdInput(data.youtube.channelIdValue) // Pre-fill if already configured
            // Also test connection if channel ID is pre-filled and API key is configured
            if (data.youtube.apiKeyConfigured) {
              testYoutubeConnection(data.youtube.channelIdValue)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch setup status:", error)
      }
    }
    fetchConfigStatus()
  }, [])

  const testYoutubeConnection = async (idToTest: string) => {
    setTestLoading(true)
    setTestResult(null)
    setChannelData(null)
    try {
      // This API call uses the server-side YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID
      const response = await fetch(`/api/youtube?test=true&channelId=${idToTest}`)
      const data = await response.json()
      if (response.ok && data.success) {
        setTestResult("success")
        setChannelData(data.channel)
      } else {
        setTestResult("error")
      }
    } catch (error) {
      setTestResult("error")
      console.error("YouTube test error:", error)
    } finally {
      setTestLoading(false)
    }
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    setSearchResults([])
    try {
      // This API call uses the server-side YOUTUBE_API_KEY
      const response = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (response.ok && data.channels) {
        setSearchResults(data.channels)
      } else {
        console.error("YouTube search failed:", data.error)
      }
    } catch (error) {
      console.error("YouTube search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">YouTube Integration Setup</h1>
          <p className="text-gray-300">Configure your YouTube API Key and Channel ID.</p>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">1. Verify YouTube API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-gray-300 text-sm mb-2">Your YouTube API Key Status:</p>
                {isApiKeyConfigured ? (
                  <p className="text-green-400 font-mono text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> Configured in Vercel Environment Variables
                  </p>
                ) : (
                  <p className="text-yellow-400 font-mono text-sm flex items-center">
                    <XCircle className="w-4 h-4 mr-2" /> Not configured. Please add `YOUTUBE_API_KEY` to Vercel.
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Get your API Key from{" "}
                <Link
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google Cloud Console
                  <ExternalLink className="inline-block w-3 h-3 ml-1" />
                </Link>
                . Enable YouTube Data API v3.
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
              <div>
                <Label htmlFor="channel-search" className="text-gray-300 mb-2 block">
                  Search for your channel by name
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="channel-search"
                    type="text"
                    placeholder="Ehhm.s"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={searchLoading || !isApiKeyConfigured} // Disable if API key not configured
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2 hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <p className="text-gray-400 text-sm">Select your channel:</p>
                  {searchResults.map((channel) => (
                    <Card
                      key={channel.id}
                      className="bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                      onClick={() => setChannelIdInput(channel.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Image
                          src={channel.image || "/placeholder.svg?height=48&width=48"}
                          alt={channel.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-white font-semibold">{channel.name}</p>
                          <p className="text-gray-400 text-sm line-clamp-1">{channel.description}</p>
                        </div>
                        {channel.id === channelIdInput && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Label htmlFor="youtube-channel-id" className="text-gray-300 mb-2 block">
                  Your YouTube Channel ID
                </Label>
                <Input
                  id="youtube-channel-id"
                  type="text"
                  placeholder="UC..."
                  value={channelIdInput}
                  onChange={(e) => setChannelIdInput(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400 mt-2">
                  You can also find your Channel ID by going to your YouTube channel, clicking on your profile picture,
                  then &quot;Settings&quot; -&gt; &quot;Advanced settings&quot;.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">3. Test Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => testYoutubeConnection(channelIdInput)}
              disabled={testLoading || !isApiKeyConfigured || !channelIdInput}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {testLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Test YouTube Connection
            </Button>

            {testResult === "success" && channelData && (
              <div className="mt-4 text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Connection Successful!</span>
                <div className="ml-4 flex items-center gap-2 text-gray-300">
                  <Image
                    src={channelData.image || "/placeholder.svg?height=32&width=32"}
                    alt={channelData.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>
                    {channelData.name} ({channelData.subscribers.toLocaleString()} subscribers)
                  </span>
                  <Link href={channelData.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                  </Link>
                </div>
              </div>
            )}
            {testResult === "error" && (
              <div className="mt-4 text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Connection Failed.</span>
                <span className="text-sm text-gray-400 ml-2">Please check your API Key and Channel ID.</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Once configured, your YouTube videos will appear on your main music portfolio page.
          </p>
          <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
