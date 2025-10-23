"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirplayIcon as Spotify, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TestSpotifyPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testSpotifyConnection()
  }, [])

  const testSpotifyConnection = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/spotify")
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error("Failed to test Spotify connection:", error)
      setData({ success: false, error: "Network error or API route issue." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Spotify className="w-8 h-8 text-green-500" />
            Spotify Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
              <p className="text-lg">Testing connection...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data?.success ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-green-300 mb-2">Connection Successful!</h3>
                  <p className="text-gray-300">Successfully fetched data for artist:</p>
                  {data.artist && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                      {data.artist.image && (
                        <Image
                          src={data.artist.image || "/placeholder.svg"}
                          alt={data.artist.name}
                          width={100}
                          height={100}
                          className="rounded-full border-2 border-green-500"
                        />
                      )}
                      <h4 className="text-xl font-semibold">{data.artist.name}</h4>
                      <p className="text-green-400">{data.artist.followers.toLocaleString()} followers</p>
                      <p className="text-gray-400 text-sm">Popularity: {data.artist.popularity}/100</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {data.artist.genres.map((genre: string, index: number) => (
                          <span key={index} className="bg-green-900/30 text-green-300 px-2 py-1 rounded-full text-xs">
                            {genre}
                          </span>
                        ))}
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-4 text-green-400 border-green-400 hover:bg-green-900/20 bg-transparent"
                      >
                        <Link href={data.artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Spotify
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-red-300 mb-2">Connection Failed</h3>
                  <p className="text-gray-300 mb-4">{data?.error || "An unknown error occurred."}</p>
                  <p className="text-gray-400 text-sm">
                    Please ensure your `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_ARTIST_ID` environment
                    variables are correctly set in Vercel.
                  </p>
                  <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
                    <Link href="/setup">Go to Setup Page</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
