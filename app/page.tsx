"use client"
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
  Music2,
  Apple,
  DownloadCloud as SoundCloud,
  Loader2,
  Eye,
  Menu,
  X,
} from "lucide-react"
import { useMusicData } from "@/hooks/use-music-data"
import { useState } from "react"
import { VisitorCounter } from "@/components/visitor-counter"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/ehhm.s", handle: "@ehhm.s" },
    { name: "Twitter", icon: Twitter, url: "https://x.com/MonTwonnow", handle: "@MonTwonnow" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@ehhms", handle: "@ehhms" },
    { name: "SoundCloud", icon: SoundCloud, url: "https://soundcloud.com/ehhm-s", handle: "ehhm-s" },
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/Baron.Ehhm", handle: "Baron.Ehhm" },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Spotify":
        return Music2
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

  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case "Spotify":
        return "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      case "YouTube":
        return "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
      case "Apple Music":
        return "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
      case "Amazon Music":
        return "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      default:
        return "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-white text-lg md:text-xl">Loading your music releases...</p>
          <p className="text-gray-400 text-xs md:text-sm mt-2">Fetching data from all platforms</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-4xl md:text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl md:text-2xl font-bold mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6 text-sm md:text-base">{error}</p>
          <Button onClick={fetchAllData} className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const spotifyReleases = releases.filter((r) => r.platform === "Spotify")
  const youtubeReleases = releases.filter((r) => r.platform === "YouTube")
  const appleMusicReleases = releases.filter((r) => r.platform === "Apple Music")
  const amazonMusicReleases = releases.filter((r) => r.platform === "Amazon Music")

  const ReleaseCard = ({ release }: { release: Release }) => {
    const PlatformIcon = getPlatformIcon(release.platform)
    const platformColor = getPlatformColor(release.platform)
    const platformBgColor = getPlatformBgColor(release.platform)

    return (
      <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={release.image || "/placeholder.svg?height=400&width=400"}
              alt={release.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm touch-manipulation">
                <Link href={release.link} target="_blank" rel="noopener noreferrer">
                  <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  {release.platform === "YouTube" ? "Watch" : "Listen"}
                </Link>
              </Button>
            </div>
            {release.isNew && <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">NEW</Badge>}
            <div className="absolute top-2 left-2">
              <PlatformIcon className={`w-5 h-5 md:w-6 md:h-6 ${platformColor}`} />
            </div>
          </div>
          <div className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-1">
              <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
              <span className="text-xs text-gray-400">{release.platform}</span>
            </div>
            <h4 className="text-sm md:text-base font-semibold text-white mb-1 line-clamp-2">{release.title}</h4>
            {release.artists && <p className="text-xs text-gray-400 mb-2 line-clamp-1">{release.artists}</p>}
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                {release.platform === "YouTube" ? <Eye className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                {release.streams}
              </span>
            </div>
            <Button
              asChild
              className={`w-full bg-gradient-to-r ${platformBgColor} text-xs md:text-sm touch-manipulation`}
              size="sm"
            >
              <Link href={release.link} target="_blank" rel="noopener noreferrer">
                {release.platform === "YouTube" ? "Watch" : "Listen"}
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Mobile-optimized Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-white">{artistData?.name || "Ehhm.s"}</h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 touch-manipulation"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <Link
                href="#releases"
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Releases
              </Link>
              <Link
                href="#social"
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Social
              </Link>
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent touch-manipulation"
              >
                Contact
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile-optimized Hero Section */}
      <section className="relative py-10 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6 md:mb-8">
            <Image
              src={artistData?.image || "/placeholder.svg?height=200&width=200&query=ehhms artist photo"}
              alt={`${artistData?.name || "Ehhm.s"} Artist Photo`}
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4 md:mb-6 border-4 border-purple-500 w-32 h-32 md:w-48 md:h-48"
            />
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-3 md:mb-4">
              {artistData?.name || "Ehhm.s"}
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto px-4">
              Electronic Music Producer & Sound Designer crafting immersive sonic experiences
            </p>

            {/* Platform Stats - Now visible on Desktop */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-4 md:mb-6">
              {platformStats.spotify?.connected && (
                <div className="flex items-center gap-2 bg-green-500/10 px-3 md:px-4 py-2 rounded-full border border-green-500/30">
                  <Music2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <span className="text-green-400 font-semibold text-xs md:text-sm">
                    {platformStats.spotify.followers.toLocaleString()} Spotify Followers
                  </span>
                </div>
              )}
              {platformStats.youtube?.connected && (
                <div className="flex items-center gap-2 bg-red-500/10 px-3 md:px-4 py-2 rounded-full border border-red-500/30">
                  <Youtube className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                  <span className="text-red-400 font-semibold text-xs md:text-sm">
                    {platformStats.youtube.subscribers.toLocaleString()} YouTube Subscribers
                  </span>
                </div>
              )}
              {platformStats.appleMusic?.connected && (
                <div className="flex items-center gap-2 bg-gray-500/10 px-3 md:px-4 py-2 rounded-full border border-gray-500/30">
                  <Apple className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <span className="text-gray-400 font-semibold text-xs md:text-sm">
                    {platformStats.appleMusic.followers.toLocaleString()} Apple Music Followers
                  </span>
                </div>
              )}
              {platformStats.amazonMusic?.connected && (
                <div className="flex items-center gap-2 bg-orange-500/10 px-3 md:px-4 py-2 rounded-full border border-orange-500/30">
                  <Music className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  <span className="text-orange-400 font-semibold text-xs md:text-sm">
                    {platformStats.amazonMusic.followers.toLocaleString()} Amazon Music Followers
                  </span>
                </div>
              )}
            </div>

            {artistData && (
              <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6">
                Popularity Score: {artistData.popularity}/100
              </p>
            )}

            {/* Genre Badges - Now more prominent on Desktop */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4">
              {artistData?.genres.length > 0 ? (
                artistData.genres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                  >
                    {genre}
                  </Badge>
                ))
              ) : (
                <>
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                  >
                    Electronic
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                  >
                    Synthwave
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                  >
                    Ambient
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-300 border-green-500/30 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                  >
                    Bass Music
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-optimized Music Releases */}
      <section id="releases" className="py-8 md:py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Latest Releases</h3>

          {/* Spotify Releases */}
          {spotifyReleases.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Music2 className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                <h4 className="text-lg md:text-2xl font-semibold text-white">Spotify</h4>
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  {spotifyReleases.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {spotifyReleases.map((release) => (
                  <ReleaseCard key={`${release.platform}-${release.id}`} release={release} />
                ))}
              </div>
            </div>
          )}

          {/* YouTube Releases */}
          {youtubeReleases.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Youtube className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                <h4 className="text-lg md:text-2xl font-semibold text-white">YouTube</h4>
                <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                  {youtubeReleases.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {youtubeReleases.map((release) => (
                  <ReleaseCard key={`${release.platform}-${release.id}`} release={release} />
                ))}
              </div>
            </div>
          )}

          {/* Apple Music Releases */}
          {appleMusicReleases.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Apple className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                <h4 className="text-lg md:text-2xl font-semibold text-white">Apple Music</h4>
                <Badge variant="outline" className="text-gray-400 border-gray-400 text-xs">
                  {appleMusicReleases.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {appleMusicReleases.map((release) => (
                  <ReleaseCard key={`${release.platform}-${release.id}`} release={release} />
                ))}
              </div>
            </div>
          )}

          {/* Amazon Music Releases */}
          {amazonMusicReleases.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Music className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
                <h4 className="text-lg md:text-2xl font-semibold text-white">Amazon Music</h4>
                <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                  {amazonMusicReleases.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {amazonMusicReleases.map((release) => (
                  <ReleaseCard key={`${release.platform}-${release.id}`} release={release} />
                ))}
              </div>
            </div>
          )}

          {releases.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-base md:text-lg">No releases found</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile-optimized Platform Stats */}
      <section className="py-8 md:py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Streaming Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 ${
                  platformStats.spotify?.connected ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <Music2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Spotify</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                {platformStats.spotify?.connected
                  ? `${platformStats.spotify.followers.toLocaleString()}`
                  : "Not Connected"}
              </p>
            </div>

            <div className="text-center">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 ${
                  platformStats.youtube?.connected ? "bg-red-500" : "bg-gray-600"
                }`}
              >
                <Youtube className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">YouTube</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                {platformStats.youtube?.connected
                  ? `${platformStats.youtube.subscribers.toLocaleString()}`
                  : "Not Connected"}
              </p>
            </div>

            <div className="text-center">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 ${
                  platformStats.appleMusic?.connected ? "bg-gray-500" : "bg-gray-600"
                }`}
              >
                <Apple className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Apple Music</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                {platformStats.appleMusic?.connected
                  ? `${platformStats.appleMusic.followers.toLocaleString()}`
                  : "Not Connected"}
              </p>
            </div>

            <div className="text-center">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 ${
                  platformStats.amazonMusic?.connected ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Amazon Music</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                {platformStats.amazonMusic?.connected
                  ? `${platformStats.amazonMusic.followers.toLocaleString()}`
                  : "Not Connected"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-optimized Social Media */}
      <section id="social" className="py-8 md:py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Connect</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon
              return (
                <Button
                  key={social.name}
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-purple-500 transition-all duration-300 bg-transparent text-xs md:text-sm touch-manipulation"
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <SocialIcon className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="truncate">{social.handle}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobile-optimized Footer with Visitor Counter */}
      <footer className="border-t border-gray-800 py-6 md:py-8 px-4">
        <div className="container mx-auto text-center space-y-4">
          <VisitorCounter />
          <p className="text-gray-400 mb-2 md:mb-4 text-sm md:text-base">
            © 2025 {artistData?.name || "Ehhm.s"}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs md:text-sm">Professional Music Production & Sound Design</p>
        </div>
      </footer>
    </div>
  )
}
