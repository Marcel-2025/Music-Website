"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AirplayIcon as Spotify } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Artist {
  id: string
  name: string
  genres: string[]
  followers: number
  popularity: number
  image: string | null
}

export default function SetupPage() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [artistQuery, setArtistQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Artist[]>([])
  const [selectedArtistId, setSelectedArtistId] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Spotify Client ID and Client Secret are required to search artists.")
      return
    }
    if (!artistQuery) {
      toast.error("Please enter an artist name to search.")
      return
    }

    setSearchLoading(true)
    setSearchResults([])
    setSelectedArtistId("")

    try {
      const response = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(artistQuery)}`, {
        headers: {
          "X-Spotify-Client-ID": clientId,
          "X-Spotify-Client-Secret": clientSecret,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to search Spotify artists.")
      }

      if (data.artists && data.artists.length > 0) {
        setSearchResults(data.artists)
      } else {
        toast.info("No artists found for your query.")
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`)
      console.error("Spotify search error:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSave = async () => {
    if (!clientId || !clientSecret || !selectedArtistId) {
      toast.error("Please provide Client ID, Client Secret, and select an Artist ID.")
      return
    }

    setLoading(true)
    try {
      // In a real application, you would send these to your backend
      // to securely store them and update environment variables.
      // For this demo, we'll simulate success.
      console.log("Saving Spotify Config:", { clientId, clientSecret, artistId: selectedArtistId })
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      toast.success("Spotify configuration saved successfully!")
      router.push("/success?platform=spotify")
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`)
      console.error("Save Spotify config error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Spotify className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-4 text-2xl">Setup Spotify Integration</CardTitle>
          <CardDescription>Connect your Spotify artist profile to track releases and statistics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientId">Spotify Client ID</Label>
            <Input
              id="clientId"
              type="password"
              placeholder="Enter your Spotify Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Spotify Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter your Spotify Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Get these from your Spotify Developer Dashboard.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artistQuery">Search Artist</Label>
            <div className="flex space-x-2">
              <Input
                id="artistQuery"
                placeholder="Enter artist name"
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
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
              <Label>Select Artist</Label>
              <div className="max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
                {searchResults.map((artist) => (
                  <div
                    key={artist.id}
                    className={`flex cursor-pointer items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedArtistId === artist.id ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                    onClick={() => setSelectedArtistId(artist.id)}
                  >
                    <Image
                      src={artist.image || "/placeholder.png?height=40&width=40&query=artist image"}
                      alt={artist.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{artist.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Followers: {artist.followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedArtistId && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Selected Artist ID: <span className="font-mono">{selectedArtistId}</span>
                </p>
              )}
            </div>
          )}

          <Button
            onClick={handleSave}
            className="w-full"
            disabled={loading || !clientId || !clientSecret || !selectedArtistId}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
