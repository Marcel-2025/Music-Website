"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Music,
  AirplayIcon as Spotify,
  Youtube,
  RefreshCw,
  ExternalLink,
  Eye,
  TrendingUp,
  Apple,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [releasesRes, spotifyRes, youtubeRes, appleMusicRes] = await Promise.allSettled([
        fetch("/api/releases"),
        fetch("/api/spotify"),
        fetch("/api/youtube"),
        fetch("/api/apple-music"), // Fetch Apple Music status
      ])

      const dashboardData = {
        releases: null,
        spotify: null,
        youtube: null,
        appleMusic: null, // Add Apple Music to dashboard data
        errors: [],
      }

      // Process releases
      if (releasesRes.status === "fulfilled" && releasesRes.value.ok) {
        dashboardData.releases = await releasesRes.value.json()
      } else {
        dashboardData.errors.push("Failed to fetch combined releases")
      }

      // Process Spotify
      if (spotifyRes.status === "fulfilled" && spotifyRes.value.ok) {
        dashboardData.spotify = await spotifyRes.value.json()
      } else if (spotifyRes.status === "fulfilled") {
        const errorData = await spotifyRes.value.json()
        dashboardData.errors.push(`Spotify: ${errorData.error}`)
      }

      // Process YouTube
      if (youtubeRes.status === "fulfilled" && youtubeRes.value.ok) {
        dashboardData.youtube = await youtubeRes.value.json()
      } else if (youtubeRes.status === "fulfilled") {
        const errorData = await youtubeRes.value.json()
        dashboardData.errors.push(`YouTube: ${errorData.error}`)
      }

      // Process Apple Music
      if (appleMusicRes.status === "fulfilled" && appleMusicRes.value.ok) {
        dashboardData.appleMusic = await appleMusicRes.value.json()
      } else if (appleMusicRes.status === "fulfilled") {
        const errorData = await appleMusicRes.value.json()
        dashboardData.errors.push(`Apple Music: ${errorData.error}`)
      }

      setData(dashboardData)
    } catch (error) {
      console.error("Dashboard fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const spotifyConnected = data?.spotify?.success
  const youtubeConnected = data?.youtube?.success
  const appleMusicConnected = data?.appleMusic?.success
  const totalReleases = data?.releases?.totalReleases || 0
  const spotifyReleases = data?.releases?.releases?.filter((r) => r.platform === "Spotify").length || 0
  const youtubeReleases = data?.releases?.releases?.filter((r) => r.platform === "YouTube").length || 0
  const appleMusicReleases = data?.releases?.releases?.filter((r) => r.platform === "Apple Music").length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Ehhm.s Music Dashboard</h1>
          <p className="text-gray-300">Complete overview of your music platform integrations</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalReleases}</div>
              <div className="text-gray-400">Total Releases</div>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  {spotifyReleases} Spotify
                </Badge>
                <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                  {youtubeReleases} YouTube
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-400 text-xs">
                  {appleMusicReleases} Apple Music
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {data?.spotify?.artist?.followers.toLocaleString() || "0"}
              </div>
              <div className="text-gray-400">Spotify Followers</div>
              <div className="flex justify-center items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Popularity: {data?.spotify?.artist?.popularity || 0}/100</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {data?.youtube?.channel?.subscribers.toLocaleString() || "0"}
              </div>
              <div className="text-gray-400">YouTube Subscribers</div>
              <div className="flex justify-center items-center gap-1 mt-2">
                <Eye className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">
                  {data?.youtube?.channel?.videoCount.toLocaleString() || 0} Videos
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Spotify Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Spotify className="w-6 h-6 text-green-500" />
                Spotify Integration
                {spotifyConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {spotifyConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {data.spotify.artist.image && (
                      <Image
                        src={data.spotify.artist.image || "/placeholder.svg"}
                        alt={data.spotify.artist.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{data.spotify.artist.name}</h4>
                      <p className="text-green-400">{data.spotify.artist.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Releases:</span>
                      <span className="text-white ml-2">{data.spotify.totalReleases}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Popularity:</span>
                      <span className="text-white ml-2">{data.spotify.artist.popularity}/100</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.spotify.artist.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-red-400">
                  <p>❌ Connection failed</p>
                  <p className="text-sm text-gray-400 mt-1">Check your Spotify credentials</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* YouTube Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" />
                YouTube Integration
                {youtubeConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {youtubeConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {data.youtube.channel.image && (
                      <Image
                        src={data.youtube.channel.image || "/placeholder.svg"}
                        alt={data.youtube.channel.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{data.youtube.channel.name}</h4>
                      <p className="text-red-400">{data.youtube.channel.subscribers.toLocaleString()} subscribers</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Videos:</span>
                      <span className="text-white ml-2">{data.youtube.channel.videoCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Views:</span>
                      <span className="text-white ml-2">{data.youtube.channel.totalViews.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={data.youtube.channel.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Channel
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-red-400">
                  <p>❌ Connection failed</p>
                  <p className="text-sm text-gray-400 mt-1">Check your YouTube credentials</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apple Music Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Apple className="w-6 h-6 text-gray-500" />
                Apple Music Integration
                {appleMusicConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appleMusicConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {data.appleMusic.artist.image && (
                      <Image
                        src={data.appleMusic.artist.image || "/placeholder.svg"}
                        alt={data.appleMusic.artist.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{data.appleMusic.artist.name}</h4>
                      <p className="text-gray-400">{data.appleMusic.artist.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Releases:</span>
                      <span className="text-white ml-2">{data.appleMusic.totalReleases}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Popularity:</span>
                      <span className="text-white ml-2">{data.appleMusic.artist.popularity}/100</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-400">
                  <p>❌ Not fully configured</p>
                  <p className="text-sm text-gray-400 mt-1">Requires Apple Developer Program and MusicKit setup.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Summary */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">✅ Configured Platforms</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-green-400">✅ SPOTIFY_CLIENT_ID=a471757...28</div>
                  <div className="text-green-400">✅ SPOTIFY_CLIENT_SECRET=38919f3...25</div>
                  <div className="text-green-400">✅ SPOTIFY_ARTIST_ID=2UsXLtDjv2GLjXuBqEtNUW</div>
                  <div className="text-green-400">✅ YOUTUBE_API_KEY=AIzaSyBB9...QPQw</div>
                  <div className="text-green-400">✅ YOUTUBE_CHANNEL_ID=UCb1pu5LwuxM2GhEKHwkiezg</div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">⚠️ Optional Platforms</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-gray-400">⚪ APPLE_MUSIC_PRIVATE_KEY=Not set</div>
                  <div className="text-gray-400">⚪ APPLE_MUSIC_KEY_ID=Not set</div>
                  <div className="text-gray-400">⚪ APPLE_MUSIC_TEAM_ID=Not set</div>
                  <div className="text-gray-400">⚪ APPLE_MUSIC_ARTIST_ID=Not set</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Errors */}
        {data?.errors?.length > 0 && (
          <Card className="mb-8 bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {data.errors.map((error, index) => (
                  <li key={index} className="text-red-300 text-sm">
                    • {error}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Link href="/">
              <Music className="w-5 h-5 mr-2" />
              View Live App
            </Link>
          </Button>

          <Button onClick={fetchDashboardData} variant="outline" size="lg" disabled={loading}>
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/test-spotify">
              <Spotify className="w-5 h-5 mr-2" />
              Test Spotify
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/setup-youtube">
              <Youtube className="w-5 h-5 mr-2" />
              Test YouTube
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/test-apple-music">
              <Apple className="w-5 h-5 mr-2" />
              Test Apple Music
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
