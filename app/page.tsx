"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Play,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  AirplayIcon as Spotify,
  Apple,
  CloudIcon as SoundCloud,
  Loader2,
  Eye,
} from "lucide-react"

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
  views?: number
}

interface PlatformStats {
  spotify?: {
    followers: number
    name: string
    connected: boolean
  }
  youtube?: {
    subscribers: number
    videoCount: number
    name: string
    connected: boolean
  }
}

interface ArtistData {
  name: string
  followers: number
  image: string
  genres: string[]
  popularity: number
}

export default function EhhmsPortfolio() {
  const [releases, setReleases] = useState<Release[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats>({})
  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/releases")
      const data = await response.json()

      if (data.releases) {
        setReleases(data.releases || [])
        setPlatformStats(data.platformStats || {})

        // Get artist data from Spotify if available
        if (data.platformStats?.spotify?.connected) {
          const spotifyResponse = await fetch("/api/spotify")
          const spotifyData = await spotifyResponse.json()
          if (spotifyData.success) {
            setArtistData(spotifyData.artist)
          }
        }
        setError(null)
      } else {
        setError(data.error || "Failed to fetch release data")
      }
    } catch (err) {
      setError("Failed to connect to APIs")
      console.error("API fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/ehhm.s", handle: "@ehhm.s" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/ehhms", handle: "@ehhms" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@ehhms", handle: "@ehhms" },
    { name: "SoundCloud", icon: SoundCloud, url: "https://soundcloud.com/ehhms", handle: "ehhm.s" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/ehhms", handle: "Ehhm.s" },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Spotify":
        return Spotify
      case "YouTube":
        return Youtube
      case "Apple Music":
        return Apple
      default:
        return Music
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Spotify":
        return "text-green-400"
      case "YouTube":
        return "text-red-400"
      case "Apple Music":
        return "text-gray-400"
      default:
        return "text-purple-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-white text-xl">Loading your music releases...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching data from Spotify and YouTube</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={fetchAllData} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
          <div className="mt-4 flex gap-4 justify-center">
            <Link href="/test-spotify" className="text-blue-400 hover:underline text-sm">
              Test Spotify
            </Link>
            <Link href="/setup-youtube" className="text-red-400 hover:underline text-sm">
              Test YouTube
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const spotifyReleases = releases.filter((r) => r.platform === "Spotify")
  const youtubeReleases = releases.filter((r) => r.platform === "YouTube")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">{artistData?.name || "Ehhm.s"}</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#releases" className="text-gray-300 hover:text-white transition-colors">
                Releases
              </Link>
              <Link href="#social" className="text-gray-300 hover:text-white transition-colors">
                Social
              </Link>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
              >
                Contact
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Image
              src={artistData?.image || "/placeholder.svg?height=200&width=200"}
              alt={`${artistData?.name || "Ehhm.s"} Artist Photo`}
              width={200}
              height={200}
              className="rounded-full mx-auto mb-6 border-4 border-purple-500"
            />
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">{artistData?.name || "Ehhm.s"}</h2>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Electronic Music Producer & Sound Designer crafting immersive sonic experiences across multiple dimensions
              of electronic music.
            </p>

            {/* Platform Stats Summary */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {platformStats.spotify?.connected && (
                <div className="flex items-center gap-2">
                  <Spotify className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    {platformStats.spotify.followers.toLocaleString()} Spotify Followers
                  </span>
                </div>
              )}
              {platformStats.youtube?.connected && (
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">
                    {platformStats.youtube.subscribers.toLocaleString()} YouTube Subscribers
                  </span>
                </div>
              )}
            </div>

            {artistData && <p className="text-gray-400 text-sm mb-6">Popularity Score: {artistData.popularity}/100</p>}

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {artistData?.genres.length > 0 ? (
                artistData.genres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    {genre}
                  </Badge>
                ))
              ) : (
                <>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Electronic
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Synthwave
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    Ambient
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    Bass Music
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Music Releases */}
      <section id="releases" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">Latest Releases</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                {spotifyReleases.length} Spotify
              </Badge>
              <Badge variant="outline" className="text-red-400 border-red-400">
                {youtubeReleases.length} YouTube
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {releases.length} Total
              </Badge>
            </div>
          </div>

          {releases.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No releases found</p>
              <p className="text-gray-500 text-sm">Check your API configurations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {releases.map((release) => {
                const PlatformIcon = getPlatformIcon(release.platform)
                const platformColor = getPlatformColor(release.platform)
                return (
                  <Card
                    key={`${release.platform}-${release.id}`}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group"
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={release.image || "/placeholder.svg?height=300&width=300"}
                          alt={release.title}
                          width={300}
                          height={300}
                          className="w-full aspect-square object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                          <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            <Link href={release.link} target="_blank" rel="noopener noreferrer">
                              <Play className="w-6 h-6 mr-2" />
                              {release.platform === "YouTube" ? "Watch" : "Listen"}
                            </Link>
                          </Button>
                        </div>
                        <Badge className="absolute top-3 right-3 bg-black/70 text-white">{release.type}</Badge>
                        <div className="absolute top-3 left-3">
                          <PlatformIcon className={`w-6 h-6 ${platformColor}`} />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon className={`w-5 h-5 ${platformColor}`} />
                          <span className="text-sm text-gray-400">{release.platform}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">{release.title}</h4>
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                          <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            {release.platform === "YouTube" ? (
                              <Eye className="w-3 h-3" />
                            ) : (
                              <Music className="w-3 h-3" />
                            )}
                            {release.streams}
                          </span>
                        </div>
                        <Button
                          asChild
                          className={`w-full ${
                            release.platform === "YouTube"
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          }`}
                        >
                          <Link href={release.link} target="_blank" rel="noopener noreferrer">
                            {release.platform === "YouTube" ? "Watch on YouTube" : "Listen on Spotify"}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Streaming Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spotify */}
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  platformStats.spotify?.connected ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <Spotify className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold">Spotify</h4>
              <p className="text-gray-400 text-sm">
                {platformStats.spotify?.connected
                  ? `${platformStats.spotify.followers.toLocaleString()} Followers`
                  : "Not Connected"}
              </p>
              <Badge
                variant="outline"
                className={
                  platformStats.spotify?.connected
                    ? "text-green-400 border-green-400 mt-2"
                    : "text-gray-400 border-gray-400 mt-2"
                }
              >
                {platformStats.spotify?.connected ? "✅ Live Data" : "❌ Disconnected"}
              </Badge>
            </div>

            {/* YouTube */}
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  platformStats.youtube?.connected ? "bg-red-500" : "bg-gray-600"
                }`}
              >
                <Youtube className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold">YouTube</h4>
              <p className="text-gray-400 text-sm">
                {platformStats.youtube?.connected
                  ? `${platformStats.youtube.subscribers.toLocaleString()} Subscribers`
                  : "Not Connected"}
              </p>
              <Badge
                variant="outline"
                className={
                  platformStats.youtube?.connected
                    ? "text-red-400 border-red-400 mt-2"
                    : "text-gray-400 border-gray-400 mt-2"
                }
              >
                {platformStats.youtube?.connected ? "✅ Live Data" : "❌ Setup Required"}
              </Badge>
            </div>

            {/* Apple Music */}
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold">Apple Music</h4>
              <p className="text-gray-400 text-sm">Not Connected</p>
              <Badge variant="outline" className="text-gray-400 border-gray-400 mt-2">
                Setup Available
              </Badge>
            </div>

            {/* Amazon Music */}
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold">Amazon Music</h4>
              <p className="text-gray-400 text-sm">Not Available</p>
              <Badge variant="outline" className="text-gray-400 border-gray-400 mt-2">
                No Public API
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section id="social" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Connect With Ehhm.s</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon
              return (
                <Button
                  key={social.name}
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-purple-500 transition-all duration-300 bg-transparent"
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <SocialIcon className="w-5 h-5 mr-2" />
                    {social.handle}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-4">© 2024 {artistData?.name || "Ehhm.s"}. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Professional Music Production & Sound Design</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Spotify Connected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              YouTube Connected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              Apple Music Available
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
