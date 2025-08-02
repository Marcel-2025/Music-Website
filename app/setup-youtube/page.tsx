"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Search, ExternalLink, Youtube, Users, Eye, Video } from "lucide-react"
import Image from "next/image"

export default function SetupYoutubePage() {
  const [searchQuery, setSearchQuery] = useState("Ehhm.s")
  const [searchResults, setSearchResults] = useState(null)
  const [selectedChannelId, setSelectedChannelId] = useState("")
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const searchChannels = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/youtube/search-channel?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data)
      } else {
        setSearchResults({
          error: data.error,
          channels: [],
        })
      }
    } catch (error) {
      setSearchResults({
        error: error.message,
        channels: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const testWithChannelId = async () => {
    if (!selectedChannelId) {
      alert("Please select a channel first")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/youtube?channelId=${selectedChannelId}`)
      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          data,
          message: `✅ Found ${data.releases?.length || 0} videos from this channel!`,
        })
      } else {
        setTestResult({
          success: false,
          message: `❌ Error: ${data.error}`,
          details: data.details,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Error: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const testApiKey = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/youtube/search-channel?q=test")
      const data = await response.json()

      if (response.ok) {
        alert("✅ YouTube API key is working!")
      } else {
        alert(`❌ API key test failed: ${data.error}`)
      }
    } catch (error) {
      alert(`❌ Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Youtube className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-white">YouTube Integration Setup</h1>
        </div>

        {/* API Key Status */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Step 1: Verify API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-gray-300 text-sm mb-2">Your YouTube API Key:</p>
                <p className="text-green-400 font-mono text-sm">✅ AIzaSyBB9...QPQw</p>
                <p className="text-yellow-400 font-mono text-sm">⚠️ Channel ID: Not set yet</p>
              </div>

              <Button onClick={testApiKey} disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? "Testing..." : "Test YouTube API Key"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Channel Search */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Step 2: Find Your YouTube Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for 'Ehhm.s' or your channel name..."
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && searchChannels()}
                />
                <Button onClick={searchChannels} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>

              {searchResults && (
                <div className="space-y-3">
                  {searchResults.error ? (
                    <div className="bg-red-900/50 border border-red-500 p-4 rounded">
                      <p className="text-red-400">Error: {searchResults.error}</p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-white font-medium">Found {searchResults.channels?.length || 0} channels:</h4>
                      {searchResults.channels?.map((channel) => (
                        <div
                          key={channel.id}
                          className={`bg-gray-700 p-4 rounded border-2 cursor-pointer transition-colors ${
                            selectedChannelId === channel.id
                              ? "border-red-500"
                              : "border-transparent hover:border-gray-500"
                          }`}
                          onClick={() => setSelectedChannelId(channel.id)}
                        >
                          <div className="flex items-center gap-4">
                            {channel.thumbnail && (
                              <Image
                                src={channel.thumbnail || "/placeholder.svg"}
                                alt={channel.title}
                                width={80}
                                height={80}
                                className="rounded-full"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="text-white font-medium">{channel.title}</h5>
                                {selectedChannelId === channel.id && <CheckCircle className="w-5 h-5 text-green-500" />}
                              </div>
                              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{channel.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {channel.subscriberCount.toLocaleString()} subscribers
                                </div>
                                <div className="flex items-center gap-1">
                                  <Video className="w-4 h-4" />
                                  {channel.videoCount.toLocaleString()} videos
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {channel.viewCount.toLocaleString()} views
                                </div>
                              </div>
                              <p className="text-red-400 text-sm font-mono">ID: {channel.id}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(channel.id)
                                  alert("Channel ID copied to clipboard!")
                                }}
                              >
                                Copy ID
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Selected Channel */}
        {selectedChannelId && (
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Step 3: Test Selected Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-gray-300 text-sm mb-2">Selected Channel ID:</p>
                  <p className="text-red-400 font-mono">{selectedChannelId}</p>
                </div>

                <Button onClick={testWithChannelId} disabled={loading} className="bg-red-600 hover:bg-red-700">
                  {loading ? "Testing..." : "Test Fetch Videos"}
                </Button>

                {testResult && (
                  <div
                    className={`p-4 rounded ${testResult.success ? "bg-green-900/50 border border-green-500" : "bg-red-900/50 border border-red-500"}`}
                  >
                    <p className="text-white font-medium">{testResult.message}</p>
                    {testResult.details && <p className="text-gray-300 text-sm mt-1">{testResult.details}</p>}

                    {testResult.success && testResult.data && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900 p-3 rounded text-center">
                          <div className="text-xl font-bold text-white">{testResult.data.totalReleases}</div>
                          <div className="text-gray-400 text-sm">Videos Found</div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded text-center">
                          <div className="text-xl font-bold text-red-400">
                            {testResult.data.channel?.subscribers.toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">Subscribers</div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded text-center">
                          <div className="text-xl font-bold text-purple-400">
                            {testResult.data.channel?.videoCount.toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">Total Videos</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-900/50 border border-blue-500 p-4 rounded">
                  <p className="text-blue-400 font-medium">Next Step:</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Once you confirm this is your channel, add this to your environment variables:
                  </p>
                  <p className="text-green-400 font-mono text-sm mt-2">YOUTUBE_CHANNEL_ID={selectedChannelId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Final Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">1. Add Your Channel ID</h4>
                <p className="text-gray-300 text-sm mb-2">
                  After finding your channel above, add it to your environment variables:
                </p>
                <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 font-mono">
                  YOUTUBE_CHANNEL_ID=your_selected_channel_id
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">2. Restart Your Development Server</h4>
                <p className="text-gray-300 text-sm">
                  After adding the environment variable, restart your dev server to load the new configuration.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">3. See Combined Results</h4>
                <p className="text-gray-300 text-sm">
                  Your main app will now show both Spotify releases and YouTube videos together!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
