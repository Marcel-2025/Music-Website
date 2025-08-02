"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function SetupYoutubePage() {
  const [apiKey, setApiKey] = useState("")
  const [channelId, setChannelId] = useState("")
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [channels, setChannels] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  const handleSearchChannel = async () => {
    if (!searchQuery) {
      toast.error("Please enter a channel name or ID to search.")
      return
    }
    setSearching(true)
    setChannels([])
    try {
      const response = await fetch(`/api/youtube/search-channel?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        setChannels(data.channels)
        if (data.channels.length === 0) {
          toast.info("No channels found for your search query.")
        }
      } else {
        toast.error(`Search failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error searching YouTube channel:", error)
      toast.error("Failed to search YouTube channel. Please check your network.")
    } finally {
      setSearching(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    setTestResult(null)
    setTestMessage(null)

    try {
      // Temporarily set environment variables for the test
      // In a real application, you'd save these to a database or secure storage
      // For this v0 example, we'll just pass them to the API route if needed,
      // or rely on them being set in Vercel for actual deployment.
      // For local testing, ensure .env.local has these.

      const response = await fetch("/api/youtube", {
        method: "GET", // This route is designed to fetch data, which implicitly tests connection
        headers: {
          "X-Youtube-Api-Key": apiKey, // Custom header for testing, not standard
          "X-Youtube-Channel-Id": channelId, // Custom header for testing, not standard
        },
      })
      const data = await response.json()

      if (response.ok && data.platformStats?.youtube?.connected) {
        setTestResult("success")
        setTestMessage("YouTube API connection successful! Data fetched.")
        toast.success("YouTube API connection successful!")
      } else {
        setTestResult("error")
        setTestMessage(`Connection failed: ${data.error || "Invalid API Key or Channel ID."}`)
        toast.error(`YouTube API connection failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      setTestResult("error")
      setTestMessage(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`)
      toast.error("An unexpected error occurred during connection test.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Setup YouTube Integration</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your YouTube API Key and Channel ID to fetch your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-gray-300">
              YouTube API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your YouTube API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Get your API Key from{" "}
              <Link
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google Cloud Console
              </Link>
              .
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelId" className="text-gray-300">
              YouTube Channel ID
            </Label>
            <Input
              id="channelId"
              placeholder="Enter your YouTube Channel ID"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Find your Channel ID{" "}
              <Link
                href="https://support.google.com/youtube/answer/3250431?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                here
              </Link>
              .
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchChannel" className="text-gray-300">
              Search for Channel (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="searchChannel"
                placeholder="Search by channel name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleSearchChannel}
                disabled={searching || !apiKey}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            {channels.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-600 bg-gray-700 p-2">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-600 cursor-pointer rounded-md"
                    onClick={() => {
                      setChannelId(channel.id)
                      setSearchQuery(channel.name)
                      setChannels([]) // Clear search results after selection
                    }}
                  >
                    {channel.image && (
                      <Image
                        src={channel.image || "/placeholder.svg"}
                        alt={channel.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm">{channel.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{channel.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleTestConnection}
            disabled={loading || !apiKey || !channelId}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Test Connection"}
          </Button>

          {testResult && (
            <div
              className={`mt-4 flex items-center justify-center gap-2 rounded-md p-3 ${
                testResult === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
              }`}
            >
              {testResult === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <p className="text-sm">{testMessage}</p>
            </div>
          )}

          <div className="text-center text-sm text-gray-400">
            <p>
              After successful connection, remember to set these as{" "}
              <Link
                href="https://vercel.com/docs/projects/environment-variables"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Environment Variables
              </Link>{" "}
              in Vercel.
            </p>
            <Link href="/dashboard" className="mt-4 inline-block text-blue-400 hover:underline">
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
