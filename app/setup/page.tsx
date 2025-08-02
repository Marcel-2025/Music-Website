"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

export default function SetupPage() {
  const [spotifyClientId, setSpotifyClientId] = useState("")
  const [spotifyClientSecret, setSpotifyClientSecret] = useState("")
  const [spotifyArtistId, setSpotifyArtistId] = useState("")
  const [loading, setLoading] = useState(false)
  const [spotifyTestResult, setSpotifyTestResult] = useState<"success" | "error" | null>(null)
  const [spotifyTestMessage, setSpotifyTestMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/setup-check")
      const data = await response.json()
      if (data.spotifyConnected) {
        setSpotifyTestResult("success")
        setSpotifyTestMessage("Spotify is already connected via environment variables.")
      }
    } catch (error) {
      console.error("Failed to check setup status:", error)
    }
  }

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const handleSearchArtist = async () => {
    if (!searchQuery) {
      toast.error("Please enter an artist name to search.")
      return
    }
    setSearching(true)
    setSearchResults([])
    try {
      const response = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data.artists)
        if (data.artists.length === 0) {
          toast.info("No artists found for your search query.")
        }
      } else {
        toast.error(`Search failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error searching Spotify artist:", error)
      toast.error("Failed to search Spotify artist. Please check your network.")
    } finally {
      setSearching(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    setSpotifyTestResult(null)
    setSpotifyTestMessage(null)

    try {
      // For local testing, these values are used. In Vercel, they come from env vars.
      // The /api/spotify route implicitly uses the env vars.
      // For a direct test with user input, you'd typically send these to a dedicated test endpoint.
      // Here, we'll just simulate a call to the main Spotify API route.
      // This assumes the API route will pick up the *actual* env vars set in Vercel,
      // or that you've manually set them in .env.local for local dev.

      // To truly test with user-provided keys, you'd need a dedicated server action/route
      // that takes these as body params and uses them for a one-off token request.
      // For simplicity in v0, we rely on the env vars being set.
      // If the user inputs values here, they are for their reference to then set in Vercel.

      const response = await fetch("/api/spotify", {
        method: "GET", // This route is designed to fetch data, which implicitly tests connection
      })
      const data = await response.json()

      if (response.ok && data.platformStats?.spotify?.connected) {
        setSpotifyTestResult("success")
        setSpotifyTestMessage("Spotify API connection successful! Data fetched.")
        toast.success("Spotify API connection successful!")
      } else {
        setSpotifyTestResult("error")
        setSpotifyTestMessage(`Connection failed: ${data.error || "Invalid API Keys or Artist ID."}`)
        toast.error(`Spotify API connection failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      setSpotifyTestResult("error")
      setSpotifyTestMessage(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`)
      toast.error("An unexpected error occurred during connection test.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Setup Spotify Integration</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your Spotify API credentials and Artist ID to fetch your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-gray-300">
              Spotify Client ID
            </Label>
            <Input
              id="clientId"
              type="password"
              placeholder="Enter your Spotify Client ID"
              value={spotifyClientId}
              onChange={(e) => setSpotifyClientId(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Get your Client ID from{" "}
              <Link
                href="https://developer.spotify.com/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Spotify for Developers
              </Link>
              .
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret" className="text-gray-300">
              Spotify Client Secret
            </Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter your Spotify Client Secret"
              value={spotifyClientSecret}
              onChange={(e) => setSpotifyClientSecret(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artistId" className="text-gray-300">
              Spotify Artist ID
            </Label>
            <Input
              id="artistId"
              placeholder="Enter your Spotify Artist ID"
              value={spotifyArtistId}
              onChange={(e) => setSpotifyArtistId(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              You can find your Artist ID in your Spotify artist page URL (e.g., https://open.spotify.com/artist/).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchArtist" className="text-gray-300">
              Search for Artist (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="searchArtist"
                placeholder="Search by artist name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleSearchArtist}
                disabled={searching || !spotifyClientId || !spotifyClientSecret}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-600 bg-gray-700 p-2">
                {searchResults.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-600 cursor-pointer rounded-md"
                    onClick={() => {
                      setSpotifyArtistId(artist.id)
                      setSearchQuery(artist.name)
                      setSearchResults([]) // Clear search results after selection
                    }}
                  >
                    {artist.image && (
                      <Image
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm">{artist.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{artist.followers.toLocaleString()} followers</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleTestConnection}
            disabled={loading || !spotifyClientId || !spotifyClientSecret || !spotifyArtistId}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Test Connection"}
          </Button>

          {spotifyTestResult && (
            <div
              className={`mt-4 flex items-center justify-center gap-2 rounded-md p-3 ${
                spotifyTestResult === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
              }`}
            >
              {spotifyTestResult === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <p className="text-sm">{spotifyTestMessage}</p>
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
