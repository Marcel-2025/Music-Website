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
  isNew?: boolean
}

interface PlatformStats {
  spotify?: {
    followers: number
    name: string
    connected: boolean
    error?: string
  }
  youtube?: {
    subscribers: number
    videoCount: number
    name: string
    connected: boolean
    error?: string
  }
  appleMusic?: {
    followers: number
    name: string
    connected: boolean
    error?: string
  }
  amazonMusic?: {
    followers: number
    name: string
    connected: boolean
    error?: string
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

  const fetchMusicData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/releases")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "An unknown error occurred while fetching music data.")
        setReleases([])
        setPlatformStats({})
        setArtistData(null)
        return
      }

      setReleases(data.releases || [])
      setPlatformStats(data.platformStats || {})
      setArtistData(data.artistData || null)
      if (data.error) {
        setError(data.error) // Set partial error if some data loaded but with issues
      }
    } catch (err: any) {
      console.error("Failed to fetch music data:", err)
      setError(`Failed to fetch music data: ${err.message}`)
      setReleases([])
      setPlatformStats({})
      setArtistData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMusicData()
  }, [fetchMusicData])

  return { releases, platformStats, artistData, loading, error, refetch: fetchMusicData }
}
