"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

interface Release {
  id: string
  title: string
  artist: string
  releaseDate?: string
  imageUrl: string
  platform: "spotify"
  url: string
}

interface SpotifyApiResponse {
  releases: Release[]
}

export default function TestSpotify() {
  const { toast } = useToast()
  const [testResult, setTestResult] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery<SpotifyApiResponse, Error>({
    queryKey: ["testSpotify"],
    queryFn: async () => {
      const response = await fetch("/api/spotify")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch Spotify data")
      }
      return response.json()
    },
    enabled: false, // Only run when manually triggered
  })

  const handleTestConnection = async () => {
    setTestResult(null)
    try {
      const { data: fetchedData } = await refetch()
      if (fetchedData && fetchedData.releases.length > 0) {
        setTestResult("success")
        toast({
          title: "Spotify Connection Successful!",
          description: `Found ${fetchedData.releases.length} releases.`,
          variant: "default",
        })
      } else {
        setTestResult("no_releases")
        toast({
          title: "Spotify Connected, but No Releases Found",
          description: "The API connection was successful, but no releases were returned for the configured artist ID.",
          variant: "default",
        })
      }
    } catch (err: any) {
      setTestResult("failure")
      toast({
        title: "Spotify Connection Failed!",
        description: err.message || "Please check your API credentials and artist ID in the setup.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Spotify Connection</CardTitle>
          <CardDescription>Verify your Spotify API credentials and artist ID.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTestConnection} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>

          {testResult === "success" && data && (
            <div className="mt-4 space-y-4">
              <p className="text-green-600 font-semibold">Connection successful! Here are some recent releases:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.releases.slice(0, 4).map((release) => (
                  <Card key={release.id}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Image
                        alt={release.title}
                        className="rounded-md object-cover mb-2"
                        height={120}
                        src={release.imageUrl || "/placeholder.svg"}
                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                        width={120}
                      />
                      <h4 className="font-semibold text-sm line-clamp-2">{release.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{release.artist}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {testResult === "no_releases" && (
            <p className="text-yellow-600 font-semibold">
              Connection successful, but no releases found for the configured artist ID. Please double-check the artist
              ID.
            </p>
          )}

          {testResult === "failure" && error && (
            <p className="text-red-600 font-semibold">
              Connection failed: {error.message}. Please check your Spotify Client ID, Client Secret, and Artist ID in
              the setup page.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
