"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirplayIcon as Spotify, Search, Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Artist {
  id: string
  name: string
  followers: number
  popularity: number
  genres: string[]
  image: string | null
  spotifyUrl: string
}

export default function SetupPage() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [artistId, setArtistId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Artist[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [currentConfig, setCurrentConfig] = useState<{
    clientId: boolean
    clientSecret: boolean
    artistId: boolean
  }>({
    clientId: false,
    clientSecret: false,
    artistId: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    checkCurrentConfig()
  }, [])

  const checkCurrentConfig = async () => {
    const res = await fetch("/api/setup-check")
    const data = await res.json()
    setCurrentConfig({
      clientId: data.spotify.clientId,
      clientSecret: data.spotify.clientSecret,
      artistId: data.spotify.artistId,
    })
  }

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Search Error",
        description: "Please enter an artist name to search.",
        type: "error",
      })
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.artists)
      } else {
        toast({
          title: "Search Failed",
          description: data.error || "Could not search for artists. Check your Client ID and Secret.",
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
      if (clientId) testParams.append("SPOTIFY_CLIENT_ID", clientId)
      if (clientSecret) testParams.append("SPOTIFY_CLIENT_SECRET", clientSecret)
      if (artistId) testParams.append("SPOTIFY_ARTIST_ID", artistId)

      const res = await fetch(`/api/spotify?${testParams.toString()}`)
      const data = await res.json()

      if (data.success) {
        setStatus("success")
        toast({
          title: "Connection Successful!",
          description: `Connected to Spotify artist: ${data.artist.name}`,
          type: "success",
        })
      } else {
        setStatus("error")
        toast({
          title: "Connection Failed",
          description: data.error || "Please check your Client ID, Client Secret, and Artist ID.",
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
          <Spotify className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Spotify Integration Setup</h1>
          <p className="text-gray-300">Configure your Spotify API credentials to fetch live artist data.</p>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">1. Enter Spotify API Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You need a Spotify Developer account to get these. Create an application and find your Client ID and
                Client Secret.
              </p>
              <div className="flex items-center gap-2">
                <Label htmlFor="clientId" className="sr-only">
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  placeholder="Your Spotify Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                {currentConfig.clientId ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="clientSecret" className="sr-only">
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Your Spotify Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                {currentConfig.clientSecret ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Note: For production, set these as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` environment variables
                in Vercel.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">2. Find Your Spotify Artist ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You can find your Artist ID by searching for your artist name below, or directly from your Spotify
                artist page URL.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search artist by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleSearch}
                  disabled={searchLoading || !clientId || !clientSecret}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="sr-only">Search</span>
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                  {searchResults.map((artist) => (
                    <div
                      key={artist.id}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        setArtistId(artist.id)
                        setSearchQuery(artist.name) // Set search query to artist name for better UX
                        setSearchResults([]) // Clear search results after selection
                      }}
                    >
                      {artist.image && (
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-white">{artist.name}</p>
                        <p className="text-xs text-gray-400">Followers: {artist.followers.toLocaleString()}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto text-green-400 border-green-400 hover:bg-green-900/20 bg-transparent"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Label htmlFor="artistId" className="sr-only">
                  Artist ID
                </Label>
                <Input
                  id="artistId"
                  placeholder="Your Spotify Artist ID"
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                {currentConfig.artistId ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Note: For production, set this as `SPOTIFY_ARTIST_ID` environment variable in Vercel.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleTestConnection}
            disabled={loading || !clientId || !clientSecret || !artistId}
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
              <h3 className="text-2xl font-bold text-green-300 mb-2">Spotify Connected Successfully!</h3>
              <p className="text-green-200 mb-4">Your Spotify data should now appear on the dashboard.</p>
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
              <p className="text-red-200 mb-4">Please review your credentials and Artist ID and try again.</p>
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
