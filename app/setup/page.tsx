"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, Search, AirplayIcon as Spotify } from "lucide-react"
import Link from "next/link"

interface SetupStatus {
  spotify: {
    clientIdConfigured: boolean
    clientSecretConfigured: boolean
    artistIdConfigured: boolean
    allConfigured: boolean
    artistId: string | null
  }
}

interface ArtistResult {
  id: string
  name: string
  genres: string[]
  popularity: number
  image: string
}

export default function SetupPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ArtistResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  const fetchSetupStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-check")
      const data: SetupStatus = await response.json()
      setStatus(data)
      setSelectedArtistId(data.spotify.artistId) // Pre-fill if already configured
    } catch (error) {
      console.error("Failed to fetch setup status:", error)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSetupStatus()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery) return
    setSearchLoading(true)
    setSearchError(null)
    try {
      const response = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.artists)
      } else {
        setSearchError(data.error || "Failed to search artists.")
      }
    } catch (error) {
      setSearchError("An error occurred during search.")
      console.error("Search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSaveArtistId = async () => {
    if (!selectedArtistId) return
    // In a real application, you would save this to your database or a persistent store.
    // For this demo, we'll just update the local state and simulate success.
    alert(
      `Spotify Artist ID saved: ${selectedArtistId}. Please update your Vercel environment variable SPOTIFY_ARTIST_ID.`,
    )
    await fetchSetupStatus() // Re-fetch status to reflect potential changes
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-white ml-4">Loading setup status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Spotify className="w-6 h-6 text-green-500" /> Spotify Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="spotify-client-id-status" className="text-lg">
              Spotify Client ID (SPOTIFY_CLIENT_ID)
            </Label>
            {status?.spotify.clientIdConfigured ? (
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" /> Configured
              </span>
            ) : (
              <span className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" /> Not Configured
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="spotify-client-secret-status" className="text-lg">
              Spotify Client Secret (SPOTIFY_CLIENT_SECRET)
            </Label>
            {status?.spotify.clientSecretConfigured ? (
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" /> Configured
              </span>
            ) : (
              <span className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" /> Not Configured
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="spotify-artist-id" className="text-lg">
              Spotify Artist ID (SPOTIFY_ARTIST_ID)
            </Label>
            <div className="flex gap-2">
              <Input
                id="spotify-artist-id"
                placeholder="Enter Spotify Artist ID or search below"
                value={selectedArtistId || ""}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button
                onClick={handleSaveArtistId}
                disabled={!selectedArtistId}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save ID
              </Button>
            </div>
            {status?.spotify.artistIdConfigured ? (
              <p className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" /> Artist ID is configured.
              </p>
            ) : (
              <p className="flex items-center text-red-400 text-sm">
                <XCircle className="w-4 h-4 mr-1" /> Artist ID is not configured. Please set it in Vercel.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="artist-search" className="text-lg">
              Search Spotify Artist
            </Label>
            <div className="flex gap-2">
              <Input
                id="artist-search"
                placeholder="Search by artist name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={!status?.spotify.clientIdConfigured || !status?.spotify.clientSecretConfigured}
              />
              <Button
                onClick={handleSearch}
                disabled={
                  searchLoading || !status?.spotify.clientIdConfigured || !status?.spotify.clientSecretConfigured
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="ml-2">Search</span>
              </Button>
            </div>
            {(!status?.spotify.clientIdConfigured || !status?.spotify.clientSecretConfigured) && (
              <p className="text-red-400 text-sm">
                Please configure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to enable artist search.
              </p>
            )}
            {searchError && <p className="text-red-400 text-sm">{searchError}</p>}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                {searchResults.map((artist) => (
                  <Card
                    key={artist.id}
                    className="bg-gray-700 border-gray-600 flex items-center p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedArtistId(artist.id)}
                  >
                    <img
                      src={artist.image || "/placeholder.svg?height=48&width=48"}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-white">{artist.name}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{artist.genres.join(", ")}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
            {status?.spotify.allConfigured ? (
              <span className="flex items-center text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> Spotify is fully configured!
              </span>
            ) : (
              <span className="flex items-center text-red-400 font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> Spotify setup incomplete.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
