"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Music, AirplayIcon as Spotify, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SuccessPage() {
  const [spotifyData, setSpotifyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testSpotifyConnection()
  }, [])

  const testSpotifyConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/spotify")
      const data = await response.json()
      setSpotifyData(data)
    } catch (error) {
      console.error("Failed to test connection:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">🎉 Spotify Integration Complete!</h1>
          <p className="text-gray-300">
            Your music app is now connected to Spotify and ready to showcase your releases.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Spotify className="w-6 h-6 text-green-500" />
              Spotify Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-300">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Testing connection...
              </div>
            ) : spotifyData?.success ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Successfully connected to Spotify!
                </div>

                {spotifyData.artist && (
                  <div className="bg-gray-900 p-4 rounded">
                    <div className="flex items-center gap-4 mb-4">
                      {spotifyData.artist.image && (
                        <Image
                          src={spotifyData.artist.image || "/placeholder.svg"}
                          alt={spotifyData.artist.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="text-white text-xl font-bold">{spotifyData.artist.name}</h3>
                        <p className="text-green-400">{spotifyData.artist.followers.toLocaleString()} followers</p>
                        <p className="text-gray-400">Popularity: {spotifyData.artist.popularity}/100</p>
                      </div>
                    </div>

                    {spotifyData.artist.genres.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-300 text-sm mb-2">Genres:</p>
                        <div className="flex flex-wrap gap-2">
                          {spotifyData.artist.genres.map((genre, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-900 p-4 rounded">
                    <div className="text-2xl font-bold text-white">{spotifyData.totalReleases || 0}</div>
                    <div className="text-gray-400 text-sm">Total Releases</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded">
                    <div className="text-2xl font-bold text-green-400">
                      {spotifyData.artist?.followers.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Spotify Followers</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded">
                    <div className="text-2xl font-bold text-purple-400">{spotifyData.artist?.popularity || 0}/100</div>
                    <div className="text-gray-400 text-sm">Popularity Score</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-400">❌ Connection failed: {spotifyData?.error || "Unknown error"}</div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-green-400">✅ SPOTIFY_CLIENT_ID=a471757...28</div>
              <div className="text-green-400">✅ SPOTIFY_CLIENT_SECRET=38919f3...25</div>
              <div className="text-green-400">✅ SPOTIFY_ARTIST_ID=2UsXLtDjv2GLjXuBqEtNUW</div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold">Your App is Live!</h4>
                  <p className="text-gray-300 text-sm">
                    Visit your main app to see your Spotify releases displayed beautifully.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold">Add YouTube (Optional)</h4>
                  <p className="text-gray-300 text-sm">
                    Set up YouTube Data API to display your music videos alongside Spotify releases.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold">Add Apple Music (Optional)</h4>
                  <p className="text-gray-300 text-sm">Connect Apple Music API for complete platform coverage.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-white font-semibold">Deploy to Production</h4>
                  <p className="text-gray-300 text-sm">Deploy your app to Vercel or your preferred hosting platform.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Link href="/">
              <Music className="w-5 h-5 mr-2" />
              View Your Music App
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent"
          >
            <Link href="/test-spotify">
              <Spotify className="w-5 h-5 mr-2" />
              Test Spotify Again
            </Link>
          </Button>

          <Button onClick={testSpotifyConnection} variant="outline" size="lg" disabled={loading}>
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  )
}
