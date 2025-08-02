"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Search, Music, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function TestSpotifyPage() {
  const [testResult, setTestResult] = useState(null)
  const [searchQuery, setSearchQuery] = useState("Ehhm.s")
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState("")

  const testCredentials = async () => {
    setLoading(true)
    try {
      // Test basic auth first
      const response = await fetch("/api/spotify/search-artist?q=test")
      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: "✅ Spotify credentials are working!",
          details: "Successfully authenticated with Spotify API",
        })
      } else {
        setTestResult({
          success: false,
          message: "❌ Spotify credentials failed",
          details: data.error || "Unknown error",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "❌ Connection failed",
        details: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const searchArtists = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/spotify/search-artist?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data)
      } else {
        setSearchResults({
          error: data.error,
          artists: [],
        })
      }
    } catch (error) {
      setSearchResults({
        error: error.message,
        artists: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const testWithArtistId = async () => {
    if (!selectedArtistId) {
      alert("Please select an artist first")
      return
    }

    setLoading(true)
    try {
      // Temporarily set the artist ID for testing
      const response = await fetch(`/api/spotify?artistId=${selectedArtistId}`)
      const data = await response.json()

      if (response.ok) {
        alert(`✅ Found ${data.releases?.length || 0} releases for this artist!`)
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Music className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Spotify Integration Test</h1>
        </div>

        {/* Credentials Test */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Step 1: Test Your Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-gray-300 text-sm mb-2">Your current credentials:</p>
                <p className="text-green-400 font-mono text-sm">✅ Client ID: a471757...28</p>
                <p className="text-green-400 font-mono text-sm">✅ Client Secret: 38919f3...25</p>
                <p className="text-yellow-400 font-mono text-sm">⚠️ Artist ID: Not set yet</p>
              </div>

              <Button onClick={testCredentials} disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Testing..." : "Test Spotify Connection"}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded ${testResult.success ? "bg-green-900/50 border border-green-500" : "bg-red-900/50 border border-red-500"}`}
                >
                  <p className="text-white font-medium">{testResult.message}</p>
                  <p className="text-gray-300 text-sm mt-1">{testResult.details}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Artist Search */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Step 2: Find Your Artist ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for 'Ehhm.s' or your artist name..."
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && searchArtists()}
                />
                <Button onClick={searchArtists} disabled={loading}>
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
                      <h4 className="text-white font-medium">Found {searchResults.artists?.length || 0} artists:</h4>
                      {searchResults.artists?.map((artist) => (
                        <div
                          key={artist.id}
                          className={`bg-gray-700 p-4 rounded border-2 cursor-pointer transition-colors ${
                            selectedArtistId === artist.id
                              ? "border-purple-500"
                              : "border-transparent hover:border-gray-500"
                          }`}
                          onClick={() => setSelectedArtistId(artist.id)}
                        >
                          <div className="flex items-center gap-4">
                            {artist.image && (
                              <Image
                                src={artist.image || "/placeholder.svg"}
                                alt={artist.name}
                                width={60}
                                height={60}
                                className="rounded-full"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="text-white font-medium">{artist.name}</h5>
                                {selectedArtistId === artist.id && <CheckCircle className="w-5 h-5 text-green-500" />}
                              </div>
                              <p className="text-gray-400 text-sm">
                                {artist.followers.toLocaleString()} followers • Popularity: {artist.popularity}/100
                              </p>
                              <p className="text-gray-400 text-sm">
                                Genres: {artist.genres.join(", ") || "None listed"}
                              </p>
                              <p className="text-purple-400 text-sm font-mono mt-1">ID: {artist.id}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(artist.id)
                                  alert("Artist ID copied to clipboard!")
                                }}
                              >
                                Copy ID
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
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

        {/* Test with Artist ID */}
        {selectedArtistId && (
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Step 3: Test with Selected Artist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-gray-300 text-sm mb-2">Selected Artist ID:</p>
                  <p className="text-purple-400 font-mono">{selectedArtistId}</p>
                </div>

                <Button onClick={testWithArtistId} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? "Testing..." : "Test Fetch Releases"}
                </Button>

                <div className="bg-blue-900/50 border border-blue-500 p-4 rounded">
                  <p className="text-blue-400 font-medium">Next Step:</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Once you confirm this is your artist, add this to your environment variables:
                  </p>
                  <p className="text-green-400 font-mono text-sm mt-2">SPOTIFY_ARTIST_ID={selectedArtistId}</p>
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
                <h4 className="text-white font-semibold mb-2">1. Add Your Artist ID</h4>
                <p className="text-gray-300 text-sm mb-2">
                  After finding your artist above, add it to your environment variables:
                </p>
                <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 font-mono">
                  SPOTIFY_ARTIST_ID=your_selected_artist_id
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">2. Restart Your Development Server</h4>
                <p className="text-gray-300 text-sm">
                  After adding the environment variable, restart your dev server to load the new configuration.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">3. Test Your Full Integration</h4>
                <p className="text-gray-300 text-sm">
                  Visit your main app to see your real Spotify releases displayed!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
