"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AirplayIcon as Spotify, Search, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Artist {
  id: string
  name: string
  followers: number
  popularity: number
  image: string
  genres: string[]
}

export default function TestSpotifyPage() {
  const [clientId, setClientId] = useState(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "")
  const [clientSecret, setClientSecret] = useState(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "")
  const [artistId, setArtistId] = useState(process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID || "")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Artist[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [artistData, setArtistData] = useState<any>(null)

  useEffect(() => {
    // Attempt to fetch artist data if artistId is already set
    if (artistId) {
      testSpotifyConnection(artistId)
    }
  }, [])

  const testSpotifyConnection = async (idToTest: string) => {
    setTestLoading(true)
    setTestResult(null)
    setArtistData(null)
    try {
      const response = await fetch(`/api/spotify?test=true&artistId=${idToTest}`)
      const data = await response.json()
      if (data.success) {
        setTestResult("success")
        setArtistData(data.artist)
      } else {
        setTestResult("error")
      }
    } catch (error) {
      setTestResult("error")
      console.error("Spotify test error:", error)
    } finally {
      setTestLoading(false)
    }
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    setSearchResults([])
    try {
      const response = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.artists) {
        setSearchResults(data.artists)
      } else {
        console.error("Spotify search failed:", data.error)
      }
    } catch (error) {
      console.error("Spotify search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Spotify className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Spotify Integration Test</h1>
          <p className="text-gray-300">Verify your Spotify API credentials and Artist ID.</p>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">1. Enter Spotify API Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-id" className="text-gray-300 mb-2 block">
                  Client ID
                </Label>
                <Input
                  id="client-id"
                  type="text"
                  placeholder="a471757..."
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="client-secret" className="text-gray-300 mb-2 block">
                  Client Secret
                </Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="38919f3..."
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Get your credentials from{" "}
              <Link
                href="https://developer.spotify.com/dashboard/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Spotify Developer Dashboard
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">2. Find Your Spotify Artist ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="artist-search" className="text-gray-300 mb-2 block">
                  Search for your artist by name
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="artist-search"
                    type="text"
                    placeholder="Ehhm.s"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={searchLoading || !clientId || !clientSecret}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-2 hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <p className="text-gray-400 text-sm">Select your artist:</p>
                  {searchResults.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                      onClick={() => setArtistId(artist.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Image
                          src={artist.image || "/placeholder.svg?height=48&width=48"}
                          alt={artist.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-white font-semibold">{artist.name}</p>
                          <p className="text-gray-400 text-sm">{artist.followers.toLocaleString()} followers</p>
                        </div>
                        {artist.id === artistId && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Label htmlFor="spotify-artist-id" className="text-gray-300 mb-2 block">
                  Your Spotify Artist ID
                </Label>
                <Input
                  id="spotify-artist-id"
                  type="text"
                  placeholder="2UsXLt..."
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400 mt-2">
                  You can find your Artist ID in the URL when viewing your artist page on Spotify (e.g.,
                  `spotify.com/artist/YOUR_ARTIST_ID`).
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
              onClick={() => testSpotifyConnection(artistId)}
              disabled={testLoading || !clientId || !clientSecret || !artistId}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {testLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Test Spotify Connection
            </Button>

            {testResult === "success" && artistData && (
              <div className="mt-4 text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Connection Successful!</span>
                <div className="ml-4 flex items-center gap-2 text-gray-300">
                  <Image
                    src={artistData.image || "/placeholder.svg?height=32&width=32"}
                    alt={artistData.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>
                    {artistData.name} ({artistData.followers.toLocaleString()} followers)
                  </span>
                </div>
              </div>
            )}
            {testResult === "error" && (
              <div className="mt-4 text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Connection Failed.</span>
                <span className="text-sm text-gray-400 ml-2">Please check your credentials and Artist ID.</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Once configured, your Spotify releases will appear on your main music portfolio page.
          </p>
          <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
