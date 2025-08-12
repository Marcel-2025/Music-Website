"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MusicIcon, YoutubeIcon, PodcastIcon as SpotifyIcon, AppleIcon, CloudIcon as AmazonIcon } from "lucide-react"
import { useMusicData } from "@/hooks/use-music-data"
import Image from "next/image"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"

interface SetupStatus {
  spotify: { isSetup: boolean; clientId: boolean; clientSecret: boolean; artistId: boolean }
  youtube: { isSetup: boolean; apiKey: boolean; channelId: boolean }
  appleMusic: { isSetup: boolean }
  amazonMusic: { isSetup: boolean }
}

export default function Dashboard() {
  const { data: musicData, isLoading: isMusicDataLoading, error: musicDataError } = useMusicData()
  const {
    data: setupStatus,
    isLoading: isSetupStatusLoading,
    error: setupStatusError,
  } = useQuery<SetupStatus, Error>({
    queryKey: ["setupStatus"],
    queryFn: async () => {
      const response = await fetch("/api/setup-check")
      if (!response.ok) {
        throw new Error("Failed to fetch setup status")
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 10, // Setup status can be cached for longer
  })

  const totalReleases = musicData?.releases.length || 0
  const newReleasesLast7Days =
    musicData?.releases.filter((release) => {
      const releaseDate = new Date(release.releaseDate || release.publishedAt || "")
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return releaseDate >= sevenDaysAgo
    }).length || 0

  const platformsConnected = Object.values(setupStatus || {}).filter((platform) => (platform as any).isSetup).length

  const upcomingReleases = 0 // Placeholder for future functionality

  if (isMusicDataLoading || isSetupStatusLoading) {
    return <div>Loading dashboard...</div> // This will be replaced by loading.tsx
  }

  if (musicDataError) {
    return <div className="text-red-500">Error loading music data: {musicDataError.message}</div>
  }

  if (setupStatusError) {
    return <div className="text-red-500">Error loading setup status: {setupStatusError.message}</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Releases</CardTitle>
            <MusicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReleases}</div>
            <p className="text-xs text-muted-foreground">All time releases across connected platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Releases (Last 7 Days)</CardTitle>
            <MusicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newReleasesLast7Days}</div>
            <p className="text-xs text-muted-foreground">New music in the past week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms Connected</CardTitle>
            <MusicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformsConnected}</div>
            <p className="text-xs text-muted-foreground">Integrations active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Releases</CardTitle>
            <MusicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReleases}</div>
            <p className="text-xs text-muted-foreground">Releases scheduled for the future</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {musicData?.releases.slice(0, 5).map((release) => (
                <div key={release.id} className="flex items-center gap-4">
                  <Image
                    alt={release.title}
                    className="rounded-md object-cover"
                    height={64}
                    src={release.imageUrl || "/placeholder.svg"}
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width={64}
                  />
                  <div className="grid gap-1">
                    <h3 className="font-semibold">{release.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {release.artist} - {release.platform}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {format(new Date(release.releaseDate || release.publishedAt || ""), "MMM dd, yyyy")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <SpotifyIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">Spotify</h3>
                <div className="ml-auto text-sm text-muted-foreground">
                  {setupStatus?.spotify.isSetup ? "Connected" : "Not Connected"}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <YoutubeIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">YouTube</h3>
                <div className="ml-auto text-sm text-muted-foreground">
                  {setupStatus?.youtube.isSetup ? "Connected" : "Not Connected"}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AppleIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">Apple Music</h3>
                <div className="ml-auto text-sm text-muted-foreground">
                  {setupStatus?.appleMusic.isSetup ? "Connected" : "Not Connected"}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AmazonIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">Amazon Music</h3>
                <div className="ml-auto text-sm text-muted-foreground">
                  {setupStatus?.amazonMusic.isSetup ? "Connected" : "Not Connected"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
