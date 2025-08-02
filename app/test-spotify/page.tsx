"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

interface SpotifyArtistData {
  id: string
  name: string
  followers: number
  image: string
  genres: string[]
  popularity: number
  spotifyUrl: string
}

interface SpotifyRelease {
  id: string
  title: string
  platform: string
  releaseDate: string
  streams: string
  image: string
  link: string
  type: string
  artists: string
}

export default function TestSpotifyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [artistData, setArtistData] = useState<SpotifyArtistData | null>(null)
  const [releases, setReleases] = useState<SpotifyRelease[]>([])

  useEffect(() => {
    const testSpotify = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/spotify")
        const data = await res.json()

        if (data.success) {
          setArtistData(data.artist)
          setReleases(data.releases)
          toast.success("Successfully fetched Spotify data!")
        } else {
          setError(data.error || "Failed to fetch Spotify data.")
          toast.error(data.error || "Failed to fetch Spotify data.")
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
        toast.error(err.message || "An unexpected error occurred.")
        console.error("Error testing Spotify API:", err)
      } finally {
        setLoading(false)
      }
    }
    testSpotify()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted\
