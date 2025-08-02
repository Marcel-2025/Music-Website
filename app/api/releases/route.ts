import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [spotifyRes, youtubeRes, appleMusicRes, amazonMusicRes] = await Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apple-music`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/amazon-music`),
    ])

    const allReleases: any[] = []
    const platformStats: any = {}
    const errors: string[] = []
    let spotifyArtistData: any = null // To store Spotify artist data

    // Helper to safely parse JSON or get error text
    async function parseResponse(response: Response, platformName: string) {
      if (response.ok) {
        try {
          const data = await response.json()
          return { success: true, data }
        } catch (jsonError) {
          const errorText = await response.text()
          return {
            success: false,
            error: `${platformName}: Failed to parse JSON response. Body: ${errorText.substring(0, 200)}...`,
          }
        }
      } else {
        const errorText = await response.text()
        return {
          success: false,
          error: `${platformName}: Failed to fetch data. Status: ${response.status}, Body: ${errorText.substring(0, 200)}...`,
        }
      }
    }

    // Process Spotify data
    if (spotifyRes.status === "fulfilled") {
      const result = await parseResponse(spotifyRes.value, "Spotify")
      if (result.success) {
        allReleases.push(...(result.data.releases || []))
        platformStats.spotify = {
          followers: result.data.artist?.followers || 0,
          name: result.data.artist?.name || "Spotify Artist",
          connected: true,
        }
        spotifyArtistData = result.data.artist // Store artist data
      } else {
        errors.push(result.error)
        platformStats.spotify = { connected: false }
      }
    } else {
      // spotifyRes.status === "rejected"
      errors.push(`Spotify: Fetch failed due to network error or unhandled exception: ${spotifyRes.reason}`)
      platformStats.spotify = { connected: false }
    }

    // Process YouTube data
    if (youtubeRes.status === "fulfilled") {
      const result = await parseResponse(youtubeRes.value, "YouTube")
      if (result.success) {
        allReleases.push(...(result.data.releases || []))
        platformStats.youtube = {
          subscribers: result.data.channel?.subscribers || 0,
          videoCount: result.data.channel?.videoCount || 0,
          name: result.data.channel?.name || "YouTube Channel",
          connected: true,
        }
      } else {
        errors.push(result.error)
        platformStats.youtube = { connected: false }
      }
    } else {
      errors.push(`YouTube: Fetch failed due to network error or unhandled exception: ${youtubeRes.reason}`)
      platformStats.youtube = { connected: false }
    }

    // Process Apple Music data
    if (appleMusicRes.status === "fulfilled") {
      const result = await parseResponse(appleMusicRes.value, "Apple Music")
      if (result.success) {
        allReleases.push(...(result.data.releases || []))
        platformStats.appleMusic = {
          followers: result.data.artist?.followers || 0,
          name: result.data.artist?.name || "Apple Music Artist",
          connected: true,
        }
      } else {
        errors.push(result.error)
        platformStats.appleMusic = { connected: false }
      }
    } else {
      errors.push(`Apple Music: Fetch failed due to network error or unhandled exception: ${appleMusicRes.reason}`)
      platformStats.appleMusic = { connected: false }
    }

    // Process Amazon Music data
    if (amazonMusicRes.status === "fulfilled") {
      const result = await parseResponse(amazonMusicRes.value, "Amazon Music")
      if (result.success) {
        allReleases.push(...(result.data.releases || []))
        platformStats.amazonMusic = {
          followers: result.data.artist?.followers || 0,
          name: result.data.artist?.name || "Amazon Music Artist",
          connected: true,
        }
      } else {
        errors.push(result.error)
        platformStats.amazonMusic = { connected: false }
      }
    } else {
      errors.push(`Amazon Music: Fetch failed due to network error or unhandled exception: ${amazonMusicRes.reason}`)
      platformStats.amazonMusic = { connected: false }
    }

    // Sort releases by date, newest first
    allReleases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

    return NextResponse.json({
      success: true,
      releases: allReleases,
      platformStats,
      artistData: spotifyArtistData, // Include Spotify artist data here
      totalReleases: allReleases.length,
      errors: errors.length > 0 ? errors : null,
    })
  } catch (error) {
    console.error("Error in /api/releases:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching releases",
      },
      { status: 500 },
    )
  }
}
