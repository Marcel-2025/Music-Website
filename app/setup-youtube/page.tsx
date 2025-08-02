"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Youtube } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Channel {
  id: string
  name: string
  description: string
  thumbnail: string
}

export default function SetupYoutubePage() {
  const [apiKey, setApiKey] = useState("")
  const [channelQuery, setChannelQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Channel[]>([])
  const [selectedChannelId, setSelectedChannelId] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!apiKey) {
      toast.error("YouTube API Key is required to search channels.")
      return
    }
    if (!channelQuery) {
      toast.error("Please enter a channel name or ID to search.")
      return
    }

    setSearchLoading(true)
    setSearchResults([])
    setSelectedChannelId("")

    try {
      const response = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(channelQuery)}`, {
        headers: {
          "X-YouTube-API-Key": apiKey, // Pass API key via header for this specific search
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to search YouTube channels.")
      }

      if (data.channels && data.channels.length > 0) {
        setSearchResults(data.channels)
      } else {
        toast.info("No channels found for your query.")
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`)
      console.error("YouTube search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey || !selectedChannelId) {
      toast.error("Please provide both API Key and select a Channel ID.")
      return
    }

    setLoading(true)
    try {
      // In a real application, you would send these to your backend
      // to securely store them and update environment variables.
      // For this demo, we'll simulate success.
      console.log("Saving YouTube Config:", { apiKey, channelId: selectedChannelId })
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      toast.success("YouTube configuration saved successfully!")
      router.push("/success?platform=youtube")
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`)
      console.error("Save YouTube config error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Youtube className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-2xl">Setup YouTube Integration</CardTitle>
          <CardDescription>Connect your YouTube channel to track video releases and statistics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">YouTube Data API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your YouTube Data API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Get your API key from the Google Cloud Console.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channelQuery">Search Channel</Label>
            <div className="flex space-x-2">
              <Input
                id="channelQuery"
                placeholder="Enter channel name or ID"
                value={channelQuery}
                onChange={(e) => setChannelQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Select Channel</Label>
              <div className="max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
                {searchResults.map((channel) => (
                  <div
                    key={channel.id}
                    className={`flex cursor-pointer items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedChannelId === channel.id ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    <Image
                      src={channel.thumbnail || "/placeholder.png?height=40&width=40&query=channel thumbnail"}
                      alt={channel.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{channel.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{channel.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedChannelId && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Selected Channel ID: <span className="font-mono">{selectedChannelId}</span>
                </p>
              )}
            </div>
          )}

          <Button onClick={handleSave} className="w-full" disabled={loading || !apiKey || !selectedChannelId}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
