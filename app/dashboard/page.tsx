"use client"

import { useMusicData } from "@/hooks/use-music-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Activity,
  Calendar,
  ChevronDown,
  ExternalLink,
  Headphones,
  Music,
  Users,
  Youtube,
  Apple,
  AppleIcon as Amazon,
  AirplayIcon as Spotify,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardPage() {
  const { releases, platformStats, artistData, loading, error, refetch } = useMusicData()

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div className="text-lg font-semibold">Loading your music data...</div>
        <p className="text-muted-foreground">This might take a moment as we fetch data from all platforms.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-destructive">Error Loading Data</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Please ensure your API keys are correctly configured in your Vercel Environment Variables.
        </p>
        <Link href="/setup" className="mt-2 text-sm text-primary hover:underline">
          Go to Setup Page
        </Link>
      </div>
    )
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Spotify":
        return <Spotify className="h-4 w-4" />
      case "YouTube":
        return <Youtube className="h-4 w-4" />
      case "Apple Music":
        return <Apple className="h-4 w-4" />
      case "Amazon Music":
        return <Amazon className="h-4 w-4" />
      default:
        return <Music className="h-4 w-4" />
    }
  }

  const getPlatformLink = (platform: string, artistUrl?: string) => {
    switch (platform) {
      case "Spotify":
        return artistUrl || `https://open.spotify.com/artist/${process.env.SPOTIFY_ARTIST_ID}`
      case "YouTube":
        return artistUrl || `https://www.youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID}`
      case "Apple Music":
        return artistUrl || `https://music.apple.com/us/artist/${process.env.APPLE_MUSIC_ARTIST_ID}`
      case "Amazon Music":
        return "https://music.amazon.de/artists/B0F89B4G8H/ehhm.s" // Generic Ehhm.s link
      default:
        return "#"
    }
  }

  const totalFollowers = Object.values(platformStats).reduce((sum, platform) => {
    if (platform?.connected && typeof platform.followers === "number") {
      return sum + platform.followers
    }
    return sum
  }, 0)

  const totalReleases = releases.length

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Badge variant="outline" className="ml-2">
            {totalReleases} Releases
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            Refresh Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Latest</DropdownMenuItem>
              <DropdownMenuItem>Oldest</DropdownMenuItem>
              <DropdownMenuItem>Platform</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Artist Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center gap-4">
                  <Image
                    src={artistData?.image || "/placeholder-user.png"}
                    alt={artistData?.name || "Artist"}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{artistData?.name || "Your Artist Name"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {artistData?.genres?.join(", ") || "Electronic, Ambient"}
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Followers</p>
                      <p className="text-lg font-bold">{totalFollowers.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Releases</p>
                      <p className="text-lg font-bold">{totalReleases}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {Object.entries(platformStats).map(([platformName, stats]) => (
              <Card key={platformName}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getPlatformIcon(platformName)} {platformName}
                  </CardTitle>
                  {stats?.connected ? (
                    <Badge variant="secondary">Connected</Badge>
                  ) : (
                    <Badge variant="destructive">Disconnected</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.followers?.toLocaleString() || "N/A"}</div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  {stats?.monthlyListeners && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.monthlyListeners.toLocaleString()} Monthly Listeners
                    </p>
                  )}
                  {stats?.subscribers && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.subscribers.toLocaleString()} Subscribers
                    </p>
                  )}
                  {stats?.videoCount && (
                    <p className="text-xs text-muted-foreground mt-1">{stats.videoCount.toLocaleString()} Videos</p>
                  )}
                  <Link
                    href={getPlatformLink(platformName, artistData?.spotifyUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Latest Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="grid gap-4">
                  {releases.length > 0 ? (
                    releases.map((release) => (
                      <div key={release.id} className="flex items-center gap-4">
                        <Image
                          src={release.image || "/placeholder.png?height=80&width=80"}
                          alt={release.title}
                          width={80}
                          height={80}
                          className="aspect-square rounded-md object-cover"
                        />
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{release.title}</p>
                            {release.isNew && (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                NEU
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {release.artists} - {release.type}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getPlatformIcon(release.platform)}
                            <span>{release.platform}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{format(new Date(release.releaseDate), "MMM dd, yyyy")}</span>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button className="ml-auto bg-transparent" size="sm" variant="outline" asChild>
                                <a href={release.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View on {release.platform}</span>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View on {release.platform}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No releases found. Check your API configurations.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Activity className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">New Release Added</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;Industrial Night&quot; released on Amazon Music.
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Headphones className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Spotify Streams Update</p>
                  <p className="text-sm text-muted-foreground">&quot;Dawn of Emotions&quot; reached 100K streams.</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Youtube className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">YouTube Video Uploaded</p>
                  <p className="text-sm text-muted-foreground">New music video for &quot;Dopamine Loops&quot;.</p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
