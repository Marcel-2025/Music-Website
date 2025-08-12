"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import Image from "next/image"
import { CheckCircle2Icon, SearchIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface Artist {
  id: string
  name: string
  imageUrl: string
}

export default function Setup() {
  const { toast } = useToast()
  const [spotifyClientId, setSpotifyClientId] = useState(process.env.SPOTIFY_CLIENT_ID || "")
  const [spotifyClientSecret, setSpotifyClientSecret] = useState(process.env.SPOTIFY_CLIENT_SECRET || "")
  const [spotifyArtistId, setSpotifyArtistId] = useState(process.env.SPOTIFY_ARTIST_ID || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: searchArtists,
  } = useQuery<Artist[], Error>({
    queryKey: ["spotifySearch", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return []
      const response = await fetch(`/api/spotify/search-artist?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error("Failed to search Spotify artists")
      }
      const data = await response.json()
      return data.artists
    },
    enabled: false, // Only run when manually triggered
  })

  useEffect(() => {
    // Pre-fill from environment variables if they exist
    setSpotifyClientId(process.env.SPOTIFY_CLIENT_ID || "")
    setSpotifyClientSecret(process.env.SPOTIFY_CLIENT_SECRET || "")
    setSpotifyArtistId(process.env.SPOTIFY_ARTIST_ID || "")
  }, [])

  const handleSave = () => {
    // In a real application, you would save these to a database or environment variables
    // For this demo, we'll just show a toast.
    console.log("Saving Spotify Client ID:", spotifyClientId)
    console.log("Saving Spotify Client Secret:", spotifyClientSecret)
    console.log("Saving Spotify Artist ID:", spotifyArtistId)
    toast({
      title: "Spotify Setup Saved!",
      description: "Your Spotify credentials and artist ID have been saved.",
    })
  }

  const handleSearch = () => {
    if (searchQuery) {
      searchArtists()
    }
  }

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist)
    setSpotifyArtistId(artist.id)
    setSearchQuery(artist.name) // Pre-fill search with selected artist name
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Integration Setup</CardTitle>
          <CardDescription>Connect your Spotify account to fetch new music releases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Spotify Client ID</Label>
            <Input
              id="clientId"
              placeholder="Enter your Spotify Client ID"
              value={spotifyClientId}
              onChange={(e) => setSpotifyClientId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Spotify Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter your Spotify Client Secret"
              value={spotifyClientSecret}
              onChange={(e) => setSpotifyClientSecret(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artistSearch">Search Artist</Label>
            <div className="flex space-x-2">
              <Input
                id="artistSearch"
                placeholder="Search for an artist by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : <SearchIcon className="h-4 w-4" />}
              </Button>
            </div>
            {searchResults && searchResults.length > 0 && (
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Artists">
                    {searchResults.map((artist) => (
                      <CommandItem
                        key={artist.id}
                        onSelect={() => handleSelectArtist(artist)}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Image
                          src={artist.imageUrl || "/placeholder.svg"}
                          alt={artist.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span>{artist.name}</span>
                        {selectedArtist?.id === artist.id && (
                          <CheckCircle2Icon className="ml-auto h-4 w-4 text-green-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="artistId">Spotify Artist ID</Label>
            <Input
              id="artistId"
              placeholder="Enter the Spotify Artist ID"
              value={spotifyArtistId}
              onChange={(e) => setSpotifyArtistId(e.target.value)}
              disabled={!!selectedArtist} // Disable if an artist is selected via search
            />
            <p className="text-sm text-muted-foreground">
              This will be automatically filled if you select an artist from the search results.
            </p>
          </div>
          <Button onClick={handleSave}>Save Spotify Setup</Button>
        </CardContent>
      </Card>
    </div>
  )
}
