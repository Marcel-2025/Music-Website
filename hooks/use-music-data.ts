"use client"

import { useState, useEffect } from "react"

interface Release {
  id: string
  title: string
  platform: string
  releaseDate: string
  image: string
  link: string
  type: string
  views?: string
  streams?: string
}

interface PlatformStats {
  spotify?: { followers: number; name: string }
  youtube?: { subscribers: number; name: string }
  appleMusic?: { name: string }
}

interface MusicData {
  releases: Release[]
  platformStats: PlatformStats
  totalReleases: number
}

export function useMusicData() {
  const [data, setData] = useState<MusicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/releases")

        if (!response.ok) {
          throw new Error("Failed to fetch music data")
        }

        const musicData = await response.json()
        setData(musicData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error, refetch: () => fetchData() }
}
