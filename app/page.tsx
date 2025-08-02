"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMusicData } from "@/hooks/use-music-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile" // Corrected import
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"

export default function Home() {
  const { releases, platformStats, artistData, loading, error } = useMusicData()
  const isMobile = useIsMobile() // Corrected usage
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  const filteredReleases = releases.filter((release) => {
    if (selectedPlatform === "all") return true
    return release.platform.toLowerCase().replace(/\s/g, "") === selectedPlatform.toLowerCase().replace(/\s/g, "")
  })

  const platforms = [
    { id: "all", name: "Alle" },
    { id: "spotify", name: "Spotify" },
    { id: "youtube", name: "YouTube" },
    { id: "applemusic", name: "Apple Music" },
    { id: "amazonmusic", name: "Amazon Music" },
  ]

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Fehler beim Laden der Daten</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <p className="mt-4 text-gray-500">Bitte überprüfen Sie Ihre API-Schlüssel und die Server-Logs.</p>
        <Link href="/setup" className="mt-6">
          <Button>Setup überprüfen</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-950">
      <header className="sticky top-0 z-40 w-full border-b bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-2" href="#">
            <Image
              alt="Ehhm.s Logo"
              className="rounded-full"
              height="40"
              src="/placeholder-logo.png"
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width="40"
            />
            <span className="text-lg font-semibold">Ehhm.s Music</span>
          </Link>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Releases
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Analytics
            </Link>
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Settings
            </Link>
          </nav>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link className="w-full" href="#">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="w-full" href="#">
                    Releases
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="w-full" href="#">
                    Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="w-full" href="#">
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <section className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Willkommen, Ehhm.s!</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Spotify Follower</CardTitle>
                    <Image alt="Spotify" className="h-5 w-5" src="/placeholder.svg?height=20&width=20" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {platformStats.spotify?.connected
                        ? platformStats.spotify.followers.toLocaleString()
                        : "Nicht verbunden"}
                    </div>
                    {platformStats.spotify?.error && (
                      <p className="text-xs text-red-500">{platformStats.spotify.error}</p>
                    )}
                    {!platformStats.spotify?.connected && (
                      <Link href="/setup" className="text-xs text-blue-500 hover:underline">
                        Jetzt verbinden
                      </Link>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">YouTube Abonnenten</CardTitle>
                    <Image alt="YouTube" className="h-5 w-5" src="/placeholder.svg?height=20&width=20" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {platformStats.youtube?.connected
                        ? platformStats.youtube.subscribers.toLocaleString()
                        : "Nicht verbunden"}
                    </div>
                    {platformStats.youtube?.error && (
                      <p className="text-xs text-red-500">{platformStats.youtube.error}</p>
                    )}
                    {!platformStats.youtube?.connected && (
                      <Link href="/setup-youtube" className="text-xs text-blue-500 hover:underline">
                        Jetzt verbinden
                      </Link>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Apple Music Follower</CardTitle>
                    <Image alt="Apple Music" className="h-5 w-5" src="/placeholder.svg?height=20&width=20" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {platformStats.appleMusic?.connected
                        ? platformStats.appleMusic.followers.toLocaleString()
                        : "Nicht verbunden"}
                    </div>
                    {platformStats.appleMusic?.error && (
                      <p className="text-xs text-red-500">{platformStats.appleMusic.error}</p>
                    )}
                    {!platformStats.appleMusic?.connected && (
                      <Link href="/setup-apple-music" className="text-xs text-blue-500 hover:underline">
                        Jetzt verbinden
                      </Link>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Amazon Music Follower</CardTitle>
                    <Image alt="Amazon Music" className="h-5 w-5" src="/placeholder.svg?height=20&width=20" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {platformStats.amazonMusic?.connected
                        ? platformStats.amazonMusic.followers.toLocaleString()
                        : "Nicht verbunden"}
                    </div>
                    {platformStats.amazonMusic?.error && (
                      <p className="text-xs text-red-500">{platformStats.amazonMusic.error}</p>
                    )}
                    {!platformStats.amazonMusic?.connected && (
                      <Link href="/setup-amazon-music" className="text-xs text-blue-500 hover:underline">
                        Jetzt verbinden
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Deine Releases</h2>
            {isMobile ? (
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Plattform auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-auto">
                <TabsList>
                  {platforms.map((platform) => (
                    <TabsTrigger key={platform.id} value={platform.id}>
                      {platform.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[250px] w-full rounded-lg" />)
              : filteredReleases.map((release) => (
                  <Card key={release.id} className="relative overflow-hidden rounded-lg shadow-lg">
                    <Link href={release.link} target="_blank" rel="noopener noreferrer">
                      <Image
                        alt={release.title}
                        className="h-48 w-full object-cover"
                        height="200"
                        src={release.image || "/placeholder.svg?height=200&width=200&query=album cover"}
                        style={{
                          aspectRatio: "200/200",
                          objectFit: "cover",
                        }}
                        width="200"
                      />
                      {release.isNew && <Badge className="absolute right-2 top-2 bg-green-500 text-white">NEU</Badge>}
                      <CardContent className="p-3">
                        <CardTitle className="text-md mb-1 font-semibold">{release.title}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{release.platform}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(release.releaseDate).toLocaleDateString("de-DE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {release.streams && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Streams: {release.streams}
                          </p>
                        )}
                        {release.views && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Views: {release.views.toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                ))}
          </div>
        </section>
      </main>
    </div>
  )
}
