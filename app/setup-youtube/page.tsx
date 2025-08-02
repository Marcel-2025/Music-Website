"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Channel {
  id: string
  name: string
  image: string
  youtubeUrl: string
}

export default function SetupYoutubePage() {
  const [apiKey, setApiKey] = useState("")
  const [channelQuery, setChannelQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Channel[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [selectedChannelId, setSelectedChannelId] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)
  const [loadingCheck, setLoadingCheck] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSetup = async () => {
      setLoadingCheck(true)
      try {
        const res = await fetch("/api/setup-check")
        const data = await res.json()
        if (data.isYoutubeConfigured) {
          setIsConfigured(true)
          toast.success("YouTube API is already configured!")
        }
      } catch (error) {
        console.error("Failed to check YouTube setup:", error)
        toast.error("Failed to check YouTube setup status.")
      } finally {
        setLoadingCheck(false)
      }
    }
    checkSetup()
  }, [])

  const handleSearchChannel = async () => {
    if (!apiKey) {
      toast.error("Please enter your YouTube API Key first.")
      return
    }
    if (!channelQuery) {
      toast.error("Please enter a channel name or ID to search.")
      return
    }

    setLoadingSearch(true)
    setSearchResults([])
    setSelectedChannelId("")
    try {
      const res = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(channelQuery)}&apiKey=${apiKey}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.channels)
        if (data.channels.length === 0) {
          toast.info("No channels found for your search query.")
        }
      } else {
        toast.error(data.error || "Failed to search YouTube channels.")
      }
    } catch (error) {
      console.error("Error searching YouTube channels:", error)
      toast.error("An unexpected error occurred during channel search.")
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleSaveConfiguration = async () => {
    if (!apiKey || !selectedChannelId) {
      toast.error("Please provide both API Key and select a Channel ID.")
      return
    }

    try {
      // In a real application, you would save these to your backend/database
      // For this v0 demo, we'll simulate saving by updating environment variables
      // This part is conceptual as v0 cannot directly modify user's .env files or Vercel envs.
      // The user would manually set these in Vercel.
      toast.success("YouTube API Key and Channel ID saved! (Please set them in Vercel environment variables manually)")
      router.push("/success?platform=youtube")
    } catch (error) {
      console.error("Failed to save YouTube configuration:", error)
      toast.error("Failed to save YouTube configuration.")
    }
  }

  if (loadingCheck) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Checking YouTube API configuration...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup YouTube Integration</CardTitle>
          <CardDescription>Connect your YouTube channel to fetch video releases and statistics.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isConfigured && (
            <div className="text-center text-green-600 font-semibold">
              YouTube API is already configured!
              <Button onClick={() => router.push("/dashboard")} className="ml-2">
                Go to Dashboard
              </Button>
            </div>
          )}
          {!isConfigured && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="youtube-api-key">YouTube Data API Key</Label>
                <Input
                  id="youtube-api-key"
                  type="text"
                  placeholder="Enter your YouTube Data API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from the Google Cloud Console.
                  <Link
                    href="https://console.developers.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-primary hover:underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel-search">Search Channel</Label>
                <div className="flex gap-2">
                  <Input
                    id="channel-search"
                    type="text"
                    placeholder="Enter channel name or ID"
                    value={channelQuery}
                    onChange={(e) => setChannelQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchChannel()}
                  />
                  <Button onClick={handleSearchChannel} disabled={loadingSearch || !apiKey}>
                    {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="grid gap-2">
                  <Label>Select Your Channel</Label>
                  <div className="max-h-48 overflow-y-auto rounded-md border">
                    {searchResults.map((channel) => (
                      <div
                        key={channel.id}
                        className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-muted ${
                          selectedChannelId === channel.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedChannelId(channel.id)}
                      >
                        <Image
                          src={channel.image || "/placeholder.png?height=40&width=40&query=YouTube channel thumbnail"}
                          alt={channel.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="flex-1">{channel.name}</span>
                        <Link href={channel.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleSaveConfiguration} disabled={!apiKey || !selectedChannelId}>
                Save YouTube Configuration
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
