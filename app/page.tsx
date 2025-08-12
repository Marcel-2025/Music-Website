"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, Calendar, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface Release {
  id: string
  title: string
  artist: string
  releaseDate: string
  imageUrl: string
  platform: string
  url: string
}

export default function HomePage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const fetchReleases = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/spotify")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setReleases(data.releases || [])
    } catch (err) {
      console.error("Error fetching releases:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch releases")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReleases()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Ehhm.s Music App</h1>
            <p className="text-xl text-white/80">Track your music releases across platforms</p>
          </div>
          <Alert className="max-w-2xl mx-auto bg-red-500/20 border-red-500/50 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Error:</strong> {error}
              <Button
                onClick={fetchReleases}
                variant="outline"
                size="sm"
                className="ml-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Ehhm.s Music App</h1>
          <p className="text-xl text-white/80">Track your music releases across platforms</p>
        </div>

        {releases.length === 0 ? (
          <div className="text-center">
            <Music className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-lg">No releases found</p>
            <Button
              onClick={fetchReleases}
              variant="outline"
              className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {releases.map((release) => (
              <Card
                key={release.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={release.imageUrl || "/placeholder.svg"}
                      alt={release.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300&text=No+Image"
                      }}
                    />
                  </div>
                  <CardTitle className="text-white text-lg line-clamp-2">{release.title}</CardTitle>
                  <CardDescription className="text-white/70">{release.artist}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white/60 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(release.releaseDate)}
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                      {release.platform}
                    </Badge>
                  </div>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <a href={release.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Listen on Spotify
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
