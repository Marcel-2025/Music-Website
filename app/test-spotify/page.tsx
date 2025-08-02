"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, AirplayIcon as Spotify } from "lucide-react"
import Link from "next/link"

interface SetupStatus {
  spotify: {
    clientIdConfigured: boolean
    clientSecretConfigured: boolean
    artistIdConfigured: boolean
    allConfigured: boolean
    artistId: string | null
  }
}

interface SpotifyArtistData {
  name: string
  followers: number
  genres: string[]
  popularity: number
  image: string
}

interface SpotifyRelease {
  id: string
  title: string
  platform: string
  releaseDate: string
  image: string
  link: string
  type: string
  streams: string
}

export default function TestSpotifyPage() {
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "failure" | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [artistData, setArtistData] = useState<SpotifyArtistData | null>(null)
  const [releases, setReleases] = useState<SpotifyRelease[]>([])

  const fetchSetupStatus = async () => {
    setLoadingStatus(true)
    try {
      const response = await fetch("/api/setup-check")
      const data: SetupStatus = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch setup status:", error)
      setStatus(null)
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    fetchSetupStatus()
  }, [])

  const runSpotifyTest = async () => {
    setTestLoading(true)
    setTestResult(null)
    setTestError(null)
    setArtistData(null)
    setReleases([])

    try {
      const response = await fetch("/api/spotify")
      const data = await response.json()

      if (data.success) {
        setTestResult("success")
        setArtistData(data.artist)
        setReleases(data.releases)
      } else {
        setTestResult("failure")
        setTestError(data.error || "Unknown error during Spotify test.")
      }
    } catch (error) {
      setTestResult("failure")
      setTestError("Failed to connect to Spotify API route.")
      console.error("Spotify test error:", error)
    } finally {
      setTestLoading(false)
    }
  }

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-white ml-4">Loading setup status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Spotify className="w-6 h-6 text-green-500" /> Test Spotify Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg">Configuration Status:</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Client ID (SPOTIFY_CLIENT_ID):</span>
              {status?.spotify.clientIdConfigured ? (
                <span className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" /> Configured
                </span>
              ) : (
                <span className="flex items-center text-red-400">
                  <XCircle className="w-4 h-4 mr-1" /> Not Configured
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Client Secret (SPOTIFY_CLIENT_SECRET):</span>
              {status?.spotify.clientSecretConfigured ? (
                <span className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" /> Configured
                </span>
              ) : (
                <span className="flex items-center text-red-400">
                  <XCircle className="w-4 h-4 mr-1" /> Not Configured
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Artist ID (SPOTIFY_ARTIST_ID):</span>
              {status?.spotify.artistIdConfigured ? (
                <span className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" /> Configured
                </span>
              ) : (
                <span className="flex items-center text-red-400">
                  <XCircle className="w-4 h-4 mr-1" /> Not Configured
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={runSpotifyTest}
            disabled={testLoading || !status?.spotify.allConfigured}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {testLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Run Spotify Test
          </Button>

          {!status?.spotify.allConfigured && (
            <p className="text-red-400 text-sm text-center">
              Please configure all Spotify environment variables in Vercel to run the test.
            </p>
          )}

          {testResult === "success" && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-md space-y-3">
              <p className="flex items-center text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> Test Successful!
              </p>
              {artistData && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Artist Data:</h3>
                  <p>Name: {artistData.name}</p>
                  <p>Followers: {artistData.followers.toLocaleString()}</p>
                  <p>Popularity: {artistData.popularity}/100</p>
                  <p>Genres: {artistData.genres.join(", ")}</p>
                  {artistData.image && (
                    <img
                      src={artistData.image || "/placeholder.svg"}
                      alt={artistData.name}
                      className="w-24 h-24 rounded-full mt-2 object-cover"
                    />
                  )}
                </div>
              )}
              {releases.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Latest Releases:</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {releases.slice(0, 3).map((release) => (
                      <li key={release.id}>
                        {release.title} ({new Date(release.releaseDate).toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {testResult === "failure" && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-md space-y-3">
              <p className="flex items-center text-red-400 font-semibold">
                <XCircle className="w-5 h-5 mr-2" /> Test Failed!
              </p>
              {testError && <p className="text-red-300">Error: {testError}</p>}
              <p className="text-red-300 text-sm">
                Please check your Spotify environment variables and ensure they are correct.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/setup">
              <Button className="bg-purple-600 hover:bg-purple-700">Go to Spotify Setup</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
