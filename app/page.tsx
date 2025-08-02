"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Twitter } from "lucide-react"
import {
  Music,
  Play,
  ExternalLink,
  Instagram,
  Youtube,
  Facebook,
  AirplayIcon as Spotify,
  Apple,
  CloudIcon as SoundCloud,
  Loader2,
} from "lucide-react"
import { useMusicData } from "@/hooks/use-music-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

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
  isNew?: boolean
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
  appleMusic?: {
    followers: number
    name: string
    connected: boolean
  }
  amazonMusic?: {
    followers: number
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
  const { releases, platformStats, artistData, loading, error, refetch: fetchAllData } = useMusicData()
  const isMobile = useIsMobile()

  const [activePlatformTab, setActivePlatformTab] = useState("spotify") // Default to Spotify

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
      case "Amazon Music":
        return Music
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
      case "Amazon Music":
        return "text-orange-400"
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

  const filteredReleases = releases.filter(
    (release) => activePlatformTab === "all" || release.platform.toLowerCase().replace(/\s/g, "") === activePlatformTab,
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="absolute top-0 flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Image src="/placeholder-logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-bold">Ehhm.s Music</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm hover:underline">
            Features
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Pricing
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Contact
          </Link>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Track Your Music Releases, Simplified.
          </h1>
          <p className="text-lg text-gray-300">
            Get real-time insights into your music performance across all major platforms.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link href="/setup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              asChild
            >
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Music Releases */}
      <section id="releases" className="py-16 px-4 w-full">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8">Latest Releases</h3>

          {isMobile ? (
            <div className="mb-8">
              <Select value={activePlatformTab} onValueChange={setActivePlatformTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="applemusic">Apple Music</SelectItem>
                  <SelectItem value="amazonmusic">Amazon Music</SelectItem>
                  <SelectItem value="all">All Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Tabs value={activePlatformTab} onValueChange={setActivePlatformTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="spotify">Spotify</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="applemusic">Apple Music</TabsTrigger>
                <TabsTrigger value="amazonmusic">Amazon Music</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReleases.length > 0 ? (
              filteredReleases.map((release) => {
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
                          src={release.image || "/placeholder.png?height=300&width=300"}
                          alt={release.title}
                          width={300}
                          height={300}
                          className="w-full aspect-square object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                          <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            <Link href={release.link} target="_blank" rel="noopener noreferrer">
                              <Play className="w-6 h-6 mr-2" />
                              Listen
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
                            <Music className="w-3 h-3" />
                            {release.streams}
                          </span>
                        </div>
                        <Button
                          asChild
                          className={`w-full ${
                            release.platform === "Spotify"
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                              : release.platform === "YouTube"
                                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                : release.platform === "Apple Music"
                                  ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                                  : release.platform === "Amazon Music"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                    : ""
                          }`}
                        >
                          <Link href={release.link} target="_blank" rel="noopener noreferrer">
                            Listen on {release.platform}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No releases found for this platform.</p>
                <p className="text-gray-500 text-sm">Check your API configurations or select another platform.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platform Stats Summary */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Connect Your Platforms</h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Integrate with your favorite music services to pull all your data into one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {platformStats.spotify?.connected && (
                <Card className="flex flex-col items-center justify-center p-6 bg-gray-700 border-gray-600">
                  <Image
                    src="/placeholder.png?height=64&width=64&query=Spotify logo"
                    alt="Spotify"
                    width={64}
                    height={64}
                  />
                  <CardTitle className="mt-4 text-lg">Spotify</CardTitle>
                </Card>
              )}
              {platformStats.youtube?.connected && (
                <Card className="flex flex-col items-center justify-center p-6 bg-gray-700 border-gray-600">
                  <Image
                    src="/placeholder.png?height=64&width=64&query=YouTube logo"
                    alt="YouTube"
                    width={64}
                    height={64}
                  />
                  <CardTitle className="mt-4 text-lg">YouTube</CardTitle>
                </Card>
              )}
              {platformStats.appleMusic?.connected && (
                <Card className="flex flex-col items-center justify-center p-6 bg-gray-700 border-gray-600">
                  <Image
                    src="/placeholder.png?height=64&width=64&query=Apple Music logo"
                    alt="Apple Music"
                    width={64}
                    height={64}
                  />
                  <CardTitle className="mt-4 text-lg">Apple Music</CardTitle>
                </Card>
              )}
              {platformStats.amazonMusic?.connected && (
                <Card className="flex flex-col items-center justify-center p-6 bg-gray-700 border-gray-600">
                  <Image
                    src="/placeholder.png?height=64&width=64&query=Amazon Music logo"
                    alt="Amazon Music"
                    width={64}
                    height={64}
                  />
                  <CardTitle className="mt-4 text-lg">Amazon Music</CardTitle>
                </Card>
              )}
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
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t border-gray-800 px-4 py-6 sm:flex-row md:px-6 bg-black text-gray-400">
        <p className="text-xs">&copy; 2024 {artistData?.name || "Ehhm.s Music"}. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            <Github className="h-4 w-4 inline-block mr-1" /> GitHub
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            <Twitter className="h-4 w-4 inline-block mr-1" /> Twitter
          </Link>
        </nav>
      </footer>
    </div>
  )
}
