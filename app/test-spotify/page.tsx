"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AirplayIcon as Spotify } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"

interface ArtistData {
  name: string
  followers: number
  image: string
  genres: string[]
  popularity: number
  spotifyUrl: string
}

interface Release {
  id: string
  title: string
  platform: string
  releaseDate: string
  streams: string
  image: string
  link: string
  type: string
  totalTracks?: number
  artists?: string
}

export default function TestSpotifyPage() {
  const [loading, setLoading] = useState(false)
  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleTestConnection = async () => {
    setLoading(true)
    setArtistData(null)
    setReleases([])
    setError(null)

    try {
      const response = await fetch("/api/spotify")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Spotify data.")
      }

      if (data.success) {
        setArtistData(data.artistData)
        setReleases(data.releases)
        toast.success("Spotify connection successful!")
      } else {
        setError(data.message || "Failed to fetch Spotify data.")
        toast.error(data.message || "Failed to fetch Spotify data.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      toast.error(`Connection failed: ${err.message}`)
      console.error("Spotify test error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Spotify className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-4 text-2xl">Test Spotify Connection</CardTitle>
          <CardDescription>Verify your Spotify API keys and artist ID are correctly configured.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleTestConnection} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Test Connection"}
          </Button>

          {error && (
            <div className="text-center text-red-500">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm text-gray-500">
                Please ensure your `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_ARTIST_ID` environment
                variables are correctly set in Vercel.
              </p>
              <Link href="/setup" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                Go to Spotify Setup
              </Link>
            </div>
          )}

          {artistData && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Artist Data:</h3>
              <div className="flex items-center space-x-4">
                <Image
                  src={artistData.image || "/placeholder-user.png"}
                  alt={artistData.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <p className="text-lg font-medium">{artistData.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Followers: {artistData.followers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Popularity: {artistData.popularity}/100</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Genres: {artistData.genres.join(", ")}</p>
                  <Link
                    href={artistData.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View on Spotify
                  </Link>
                </div>
              </div>
            </div>
          )}

          {releases.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Latest Releases:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {releases.slice(0, 4).map((release) => (
                  <Card key={release.id}>
                    <CardContent className="flex items-center space-x-4 p-4">
                      <Image
                        src={release.image || "/placeholder.png?height=64&width=64&query=album cover"}
                        alt={release.title}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-medium">{release.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {release.type} by {release.artists}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(release.releaseDate).toLocaleDateString()}
                        </p>
                        <Link
                          href={release.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Listen
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
