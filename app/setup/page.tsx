"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Search, ExternalLink } from "lucide-react"

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState("Ehhm.s")
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/setup-check")
      const data = await response.json()
      setSetupStatus(data)
    } catch (error) {
      console.error("Failed to check setup status:", error)
    }
  }

  const searchArtists = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/spotify/search-artist?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Failed to search artists:", error)
    } finally {
      setLoading(false)
    }
  }

  const testSpotifyConnection = async () => {
    try {
      const response = await fetch("/api/spotify")
      const data = await response.json()
      alert(data.success ? "Spotify connection successful!" : `Error: ${data.error}`)
    } catch (error) {
      alert("Failed to test Spotify connection")
    }
  }

  if (!setupStatus) {
    return <div className="p-8">Loading setup status...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">API Setup Dashboard</h1>

        {/* Current Status */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {setupStatus.allConfigured.spotify ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-white">Spotify</span>
                <Badge variant={setupStatus.allConfigured.spotify ? "default" : "destructive"}>
                  {setupStatus.nextSteps.spotify}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {setupStatus.allConfigured.youtube ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-white">YouTube</span>
                <Badge variant={setupStatus.allConfigured.youtube ? "default" : "destructive"}>
                  {setupStatus.nextSteps.youtube}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {setupStatus.allConfigured.appleMusic ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-white">Apple Music</span>
                <Badge variant={setupStatus.allConfigured.appleMusic ? "default" : "destructive"}>
                  {setupStatus.nextSteps.appleMusic}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spotify Setup */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Spotify Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">✅ Client ID: {setupStatus.credentials.spotify.clientIdValue}</p>
              <p className="text-gray-300 mb-2">
                {setupStatus.credentials.spotify.clientSecret ? "✅" : "❌"} Client Secret:{" "}
                {setupStatus.credentials.spotify.clientSecret ? "Configured" : "Missing"}
              </p>
              <p className="text-gray-300 mb-4">
                {setupStatus.credentials.spotify.artistId ? "✅" : "❌"} Artist ID:{" "}
                {setupStatus.credentials.spotify.artistId ? "Configured" : "Missing"}
              </p>
            </div>

            {!setupStatus.credentials.spotify.artistId && (
              <div>
                <h4 className="text-white font-semibold mb-2">Find Your Artist ID</h4>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for your artist name..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={searchArtists} disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {searchResults && (
                  <div className="space-y-2">
                    <h5 className="text-white font-medium">Search Results:</h5>
                    {searchResults.artists.map((artist) => (
                      <div key={artist.id} className="bg-gray-700 p-3 rounded flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{artist.name}</p>
                          <p className="text-gray-400 text-sm">
                            {artist.followers.toLocaleString()} followers • ID: {artist.id}
                          </p>
                          <p className="text-gray-400 text-sm">Genres: {artist.genres.join(", ") || "None listed"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => navigator.clipboard.writeText(artist.id)}>
                            Copy ID
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {setupStatus.allConfigured.spotify && (
              <Button onClick={testSpotifyConnection} className="bg-green-600 hover:bg-green-700">
                Test Spotify Connection
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">1. Complete Spotify Setup</h4>
              <p className="text-gray-300 text-sm mb-2">
                You need to add your Spotify Client Secret and Artist ID to your environment variables:
              </p>
              <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 font-mono">
                SPOTIFY_CLIENT_SECRET=your_client_secret_here
                <br />
                SPOTIFY_ARTIST_ID=your_artist_id_from_search_above
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">2. Get Your Spotify Client Secret</h4>
              <p className="text-gray-300 text-sm mb-2">
                Go to your{" "}
                <a
                  href="https://developer.spotify.com/dashboard"
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  rel="noreferrer"
                >
                  Spotify Developer Dashboard
                </a>
                , select your app, and copy the Client Secret.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">3. Optional: Set up YouTube API</h4>
              <p className="text-gray-300 text-sm">
                Visit{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  rel="noreferrer"
                >
                  Google Cloud Console
                </a>
                to enable YouTube Data API v3 and get your API key.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
