"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

interface Release {
  id: string
  title: string
  artist: string
  releaseDate?: string // For Spotify
  publishedAt?: string // For YouTube
  imageUrl: string
  platform: "spotify" | "youtube" | "apple-music" | "amazon-music"
  url: string
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
  const { data, error, isLoading, refetch } = useQuery<MusicData, Error>({
    queryKey: ["musicData"],
    queryFn: async () => {
      const response = await fetch("/api/releases")
      if (!response.ok) {
        throw new Error("Failed to fetch music data")
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  })

  const [releases, setReleases] = useState<Release[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats>({})
  const [artistData, setArtistData] = useState<ArtistData | null>(null)

  useEffect(() => {
    if (data) {
      setReleases(data.releases || [])
      setPlatformStats(data.platformStats || {})
      setArtistData(data.artistData || null)
    }
  }, [data])

  return { releases, platformStats, artistData, loading: isLoading, error: error?.message || null, refetch }
}
