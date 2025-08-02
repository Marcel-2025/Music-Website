"use client"

import { useState, useEffect, useCallback } from "react"

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
  appleMusic?: {
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

interface MusicData {
  releases: Release[]
  platformStats: PlatformStats
  artistData: ArtistData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMusicData(): MusicData {
  const [releases, setReleases] = useState<Release[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats>({})
  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return { releases, platformStats, artistData, loading, error, refetch: fetchAllData }
}
