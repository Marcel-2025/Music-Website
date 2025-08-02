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
  artistData: ArtistData
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMusicData(): MusicData {
  const [releases, setReleases] = useState<Release[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    spotify: { connected: false, followers: 0, name: "Spotify" },
    youtube: { connected: false, subscribers: 0, videoCount: 0, name: "YouTube" },
    appleMusic: { connected: false, followers: 0, name: "Apple Music" },
    amazonMusic: { connected: false, followers: 0, name: "Amazon Music" },
  })
  const [artistData, setArtistData] = useState<ArtistData>({
    name: "Ehhm.s",
    followers: 0,
    image: "/placeholder-user.jpg",
    genres: [],
    popularity: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/releases") // Use relative path
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch music data")
      }
      const data = await res.json()
      setReleases(data.releases)
      setPlatformStats(data.platformStats)
      setArtistData(data.artistData)
    } catch (err: any) {
      console.error("Error in useMusicData:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { releases, platformStats, artistData, loading, error, refetch: fetchData }
}
