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

interface Artist {
  id: string
  name: string
  image: string
  followers: number
  genres: string[]
  spotifyUrl: string
}

export default function SetupPage() {
  const [spotifyClientId, setSpotifyClientId] = useState("")
  const [spotifyClientSecret, setSpotifyClientSecret] = useState("")
  const [artistQuery, setArtistQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Artist[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)
  const [loadingCheck, setLoadingCheck] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSetup = async () => {
      setLoadingCheck(true)
      try {
        const res = await fetch("/api/setup-check")
        const data = await res.json()
        if (data.isSpotifyConfigured) {
          setIsConfigured(true)
          toast.success("Spotify API is already configured!")
        }
      } catch (error) {
        console.error("Failed to check Spotify setup:", error)
        toast.error("Failed to check Spotify setup status.")
      } finally {
        setLoadingCheck(false)
      }
    }
    checkSetup()
  }, [])

  const handleSearchArtist = async () => {
    if (!spotifyClientId || !spotifyClientSecret) {
      toast.error("Please enter your Spotify Client ID and Client Secret first.")
      return
    }
    if (!artistQuery) {
      toast.error("Please enter an artist name to search.")
      return
    }

    setLoadingSearch(true)
    setSearchResults([])
    setSelectedArtistId("")
    try {
      const res = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(artistQuery)}`, {
        method: "GET",
        headers: {
          "X-Spotify-Client-Id": spotifyClientId,
          "X-Spotify-Client-Secret": spotifyClientSecret,
        },
      })
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.artists)
        if (data.artists.length === 0) {
          toast.info("No artists found for your search query.")
        }
      } else {
        toast.error(data.error || "Failed to search Spotify artists.")
      }
    } catch (error) {
      console.error("Error searching Spotify artists:", error)
      toast.error("An unexpected error occurred during artist search.")
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleSaveConfiguration = async () => {
    if (!spotifyClientId || !spotifyClientSecret || !selectedArtistId) {
      toast.error("Please provide all Spotify credentials and select an Artist ID.")
      return
    }

    try {
      // In a real application, you would save these to your backend/database
      // For this v0 demo, we'll simulate saving by updating environment variables
      // The user would manually set these in Vercel.
      toast.success(
        "Spotify API credentials and Artist ID saved! (Please set them in Vercel environment variables manually)",
      )
      router.push("/setup-youtube")
    } catch (error) {
      console.error("Failed to save Spotify configuration:", error)
      toast.error("Failed to save Spotify configuration.")
    }
  }

  if (loadingCheck) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Checking Spotify API configuration...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Spotify Integration</CardTitle>
          <CardDescription>Connect your Spotify artist profile to fetch releases and statistics.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isConfigured && (
            <div className="text-center text-green-600 font-semibold">
              Spotify API is already configured!
              <Button onClick={() => router.push("/dashboard")} className="ml-2">
                Go to Dashboard
              </Button>
            </div>
          )}
          {!isConfigured && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="client-id">Spotify Client ID</Label>
                <Input
                  id="client-id"
                  type="text"
                  placeholder="Enter your Spotify Client ID"
                  value={spotifyClientId}
                  onChange={(e) => setSpotifyClientId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-secret">Spotify Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="Enter your Spotify Client Secret"
                  value={spotifyClientSecret}
                  onChange={(e) => setSpotifyClientSecret(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Get your credentials from the Spotify Developer Dashboard.
                  <Link
                    href="https://developer.spotify.com/dashboard/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-primary hover:underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="artist-search">Search Artist</Label>
                <div className="flex gap-2">
                  <Input
                    id="artist-search"
                    type="text"
                    placeholder="Enter artist name"
                    value={artistQuery}
                    onChange={(e) => setArtistQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchArtist()}
                  />
                  <Button
                    onClick={handleSearchArtist}
                    disabled={loadingSearch || !spotifyClientId || !spotifyClientSecret}
                  >
                    {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="grid gap-2">
                  <Label>Select Your Artist</Label>
                  <div className="max-h-48 overflow-y-auto rounded-md border">
                    {searchResults.map((artist) => (
                      <div
                        key={artist.id}
                        className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-muted ${
                          selectedArtistId === artist.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedArtistId(artist.id)}
                      >
                        <Image
                          src={artist.image || "/placeholder.png?height=40&width=40&query=Spotify artist thumbnail"}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="flex-1">
                          {artist.name} ({artist.followers.toLocaleString()} followers)
                        </span>
                        <Link href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveConfiguration}
                disabled={!spotifyClientId || !spotifyClientSecret || !selectedArtistId}
              >
                Save Spotify Configuration
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
