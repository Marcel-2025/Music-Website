import { NextResponse } from "next/server"

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Fetch from all platforms in parallel
    const [spotifyRes, youtubeRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/spotify`),
      fetch(`${baseUrl}/api/youtube`),
    ])

    const allReleases = []
    const platformStats = {}

    // Process Spotify data
    if (spotifyRes.status === "fulfilled" && spotifyRes.value.ok) {
      const spotifyData = await spotifyRes.value.json()
      if (spotifyData.success) {
        allReleases.push(...spotifyData.releases)
        platformStats.spotify = {
          followers: spotifyData.artist?.followers || 0,
          name: "Spotify",
          connected: true,
        }
      }
    } else {
      platformStats.spotify = {
        name: "Spotify",
        connected: false,
        error: "Connection failed",
      }
    }

    // Process YouTube data
    if (youtubeRes.status === "fulfilled" && youtubeRes.value.ok) {
      const youtubeData = await youtubeRes.value.json()
      if (youtubeData.success) {
        allReleases.push(...youtubeData.releases)
        platformStats.youtube = {
          subscribers: youtubeData.channel?.subscribers || 0,
          videoCount: youtubeData.channel?.videoCount || 0,
          name: "YouTube",
          connected: true,
        }
      }
    } else {
      platformStats.youtube = {
        name: "YouTube",
        connected: false,
        error: "Not configured or connection failed",
      }
    }

    // Sort releases by date (newest first)
    allReleases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

    return NextResponse.json({
      releases: allReleases,
      platformStats,
      totalReleases: allReleases.length,
      connectedPlatforms: Object.values(platformStats).filter((p: any) => p.connected).length,
    })
  } catch (error) {
    console.error("Combined API Error:", error)
    return NextResponse.json({ error: "Failed to fetch release data" }, { status: 500 })
  }
}
