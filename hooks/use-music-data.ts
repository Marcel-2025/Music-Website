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
  isNew?: boolean // Added for "NEU" badge
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
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch releases: ${response.status} - ${errorText.substring(0, 200)}...`)
      }
      const data = await response.json()

      if (data.success) {
        // Check for success flag from /api/releases
        // Mark releases as new if they are recent (e.g., within the last 30 days)
        const updatedReleases = data.releases.map((release: Release) => ({
          ...release,
          isNew: new Date(release.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        }))
        setReleases(updatedReleases || [])
        setPlatformStats(data.platformStats || {})
        setArtistData(data.artistData || null) // Get artistData directly from the aggregated response
        setError(data.errors ? data.errors.join(", ") : null) // Display aggregated errors
      } else {
        setError(data.error || "Failed to fetch release data from API aggregator.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to APIs")
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
