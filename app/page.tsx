"use client"

import { useMusicData } from "@/hooks/use-music-data"
import { useViewPreferences } from "@/hooks/use-view-preferences"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlatformSection } from "@/components/platform-section"
import { Music2, Youtube, Apple, ShoppingBag, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Users } from "lucide-react"

export default function Home() {
  const { releases, platformStats, artistData, loading, error, refetch } = useMusicData()
  const viewPrefs = useViewPreferences()
  const { count, isNewVisitor, loading: visitorLoading } = useVisitorCount()

  if (loading || !viewPrefs.isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading music data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800/50 border-red-500/50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-white">Failed to Load Data</h2>
            <p className="text-gray-400">{error}</p>
            <Button onClick={refetch} className="bg-green-500 hover:bg-green-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter releases by platform
  const spotifyReleases = releases.filter((r) => r.platform === "Spotify")
  const youtubeReleases = releases.filter((r) => r.platform === "YouTube")
  const appleMusicReleases = releases.filter((r) => r.platform === "Apple Music")
  const amazonMusicReleases = releases.filter((r) => r.platform === "Amazon Music")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-4 md:mb-6">
            {artistData?.image && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-green-500/50">
                <Image
                  src={artistData.image || "/placeholder.svg"}
                  alt={artistData.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            {artistData?.name || "Ehhm.s"}
          </h1>
          <p className="text-base md:text-xl text-gray-400 mb-4 md:mb-6">Electronic Music Artist</p>

          {/* Genres - Visible on Desktop */}
          {artistData?.genres && artistData.genres.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 justify-center mb-6">
              {artistData.genres.map((genre, index) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className={`text-sm ${
                    index % 3 === 0
                      ? "text-green-400 border-green-400"
                      : index % 3 === 1
                        ? "text-blue-400 border-blue-400"
                        : "text-purple-400 border-purple-400"
                  }`}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          {/* Platform Stats - Visible on Desktop */}
          <div className="hidden md:flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
            {platformStats.spotify?.connected && (
              <Badge
                variant="outline"
                className="text-green-400 border-green-400 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2"
              >
                <Music2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                {platformStats.spotify.followers.toLocaleString()} Spotify Followers
              </Badge>
            )}
            {platformStats.youtube?.connected && (
              <Badge
                variant="outline"
                className="text-red-400 border-red-400 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2"
              >
                <Youtube className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                {platformStats.youtube.subscribers.toLocaleString()} YouTube Subscribers
              </Badge>
            )}
            {platformStats.appleMusic?.connected && (
              <Badge
                variant="outline"
                className="text-pink-400 border-pink-400 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2"
              >
                <Apple className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                Apple Music
              </Badge>
            )}
            {platformStats.amazonMusic?.connected && (
              <Badge
                variant="outline"
                className="text-blue-400 border-blue-400 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2"
              >
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                Amazon Music
              </Badge>
            )}
          </div>

          {/* Visitor Counter */}
          {!visitorLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {count.toLocaleString()} {count === 1 ? "visitor" : "visitors"}
                {isNewVisitor && <span className="text-green-400 ml-2">• You're new here!</span>}
              </span>
            </div>
          )}
        </div>

        {/* Platform Sections */}
        <div className="space-y-8 md:space-y-12">
          {/* Spotify */}
          {platformStats.spotify?.connected && spotifyReleases.length > 0 && (
            <PlatformSection
              platform="Spotify"
              icon={Music2}
              color="text-green-500"
              releases={spotifyReleases}
              visible={viewPrefs.getPreferences("spotify").isVisible}
              viewMode={viewPrefs.getPreferences("spotify").viewMode}
              gridSize={viewPrefs.getPreferences("spotify").gridSize}
              onToggleVisibility={() => viewPrefs.toggleVisibility("spotify")}
              onChangeViewMode={(mode) => viewPrefs.updateViewMode("spotify", mode)}
              onChangeGridSize={(size) => viewPrefs.updateGridSize("spotify", size)}
              platformBgColor="from-green-400 to-green-600"
            />
          )}

          {/* YouTube */}
          {platformStats.youtube?.connected && youtubeReleases.length > 0 && (
            <PlatformSection
              platform="YouTube"
              icon={Youtube}
              color="text-red-500"
              releases={youtubeReleases}
              visible={viewPrefs.getPreferences("youtube").isVisible}
              viewMode={viewPrefs.getPreferences("youtube").viewMode}
              gridSize={viewPrefs.getPreferences("youtube").gridSize}
              onToggleVisibility={() => viewPrefs.toggleVisibility("youtube")}
              onChangeViewMode={(mode) => viewPrefs.updateViewMode("youtube", mode)}
              onChangeGridSize={(size) => viewPrefs.updateGridSize("youtube", size)}
              platformBgColor="from-red-400 to-red-600"
            />
          )}

          {/* Apple Music */}
          {platformStats.appleMusic?.connected && appleMusicReleases.length > 0 && (
            <PlatformSection
              platform="Apple Music"
              icon={Apple}
              color="text-pink-500"
              releases={appleMusicReleases}
              visible={viewPrefs.getPreferences("apple music").isVisible}
              viewMode={viewPrefs.getPreferences("apple music").viewMode}
              gridSize={viewPrefs.getPreferences("apple music").gridSize}
              onToggleVisibility={() => viewPrefs.toggleVisibility("apple music")}
              onChangeViewMode={(mode) => viewPrefs.updateViewMode("apple music", mode)}
              onChangeGridSize={(size) => viewPrefs.updateGridSize("apple music", size)}
              platformBgColor="from-pink-400 to-pink-600"
            />
          )}

          {/* Amazon Music */}
          {platformStats.amazonMusic?.connected && amazonMusicReleases.length > 0 && (
            <PlatformSection
              platform="Amazon Music"
              icon={ShoppingBag}
              color="text-blue-500"
              releases={amazonMusicReleases}
              visible={viewPrefs.getPreferences("amazon music").isVisible}
              viewMode={viewPrefs.getPreferences("amazon music").viewMode}
              gridSize={viewPrefs.getPreferences("amazon music").gridSize}
              onToggleVisibility={() => viewPrefs.toggleVisibility("amazon music")}
              onChangeViewMode={(mode) => viewPrefs.updateViewMode("amazon music", mode)}
              onChangeGridSize={(size) => viewPrefs.updateGridSize("amazon music", size)}
              platformBgColor="from-blue-400 to-blue-600"
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 Ehhm.s - All Rights Reserved</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link
              href="https://open.spotify.com/artist/7c0XG5cIJTrrAgEC3sxsVa"
              target="_blank"
              className="hover:text-green-400 transition-colors"
            >
              Spotify
            </Link>
            <Link
              href="https://www.youtube.com/@Ehhm.s"
              target="_blank"
              className="hover:text-red-400 transition-colors"
            >
              YouTube
            </Link>
            <Link
              href="https://soundcloud.com/ehhm-s"
              target="_blank"
              className="hover:text-orange-400 transition-colors"
            >
              SoundCloud
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
