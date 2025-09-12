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

    // Process Spotify data
    if (spotifyRes.status === "fulfilled" && spotifyRes.value.ok) {
      const spotifyData = await spotifyRes.value.json()
      if (spotifyData.success) {
        allReleases.push(...(spotifyData.releases || []))
        platformStats.spotify = {
          followers: spotifyData.artist?.followers || 0,
          name: spotifyData.artist?.name || "Spotify Artist",
          connected: true,
        }
      } else {
        errors.push(`Spotify: ${spotifyData.error || "Unknown error"}`)
        platformStats.spotify = { connected: false }
      }
    } else {
      errors.push(`Spotify: Failed to fetch data. Status: ${spotifyRes.status}`)
      platformStats.spotify = { connected: false }
    }

    // Process YouTube data
    if (youtubeRes.status === "fulfilled" && youtubeRes.value.ok) {
      const youtubeData = await youtubeRes.value.json()
      if (youtubeData.success) {
        allReleases.push(...(youtubeData.releases || []))
        platformStats.youtube = {
          subscribers: youtubeData.channel?.subscribers || 0,
          videoCount: youtubeData.channel?.videoCount || 0,
          name: youtubeData.channel?.name || "YouTube Channel",
          connected: true,
        }
      } else {
        errors.push(`YouTube: ${youtubeData.error || "Unknown error"}`)
        platformStats.youtube = { connected: false }
      }
    } else {
      errors.push(`YouTube: Failed to fetch data. Status: ${youtubeRes.status}`)
      platformStats.youtube = { connected: false }
    }

    // Process Apple Music data
    if (appleMusicRes.status === "fulfilled" && appleMusicRes.value.ok) {
      const appleMusicData = await appleMusicRes.value.json()
      if (appleMusicData.success) {
        allReleases.push(...(appleMusicData.releases || []))
        platformStats.appleMusic = {
          followers: appleMusicData.artist?.followers || 0,
          name: appleMusicData.artist?.name || "Apple Music Artist",
          connected: true,
        }
      } else {
        errors.push(`Apple Music: ${appleMusicData.error || "Unknown error"}`)
        platformStats.appleMusic = { connected: false }
      }
    } else {
      errors.push(`Apple Music: Failed to fetch data. Status: ${appleMusicRes.status}`)
      platformStats.appleMusic = { connected: false }
    }

    // Process Amazon Music data
    if (amazonMusicRes.status === "fulfilled" && amazonMusicRes.value.ok) {
      const amazonMusicData = await amazonMusicRes.value.json()
      if (amazonMusicData.success) {
        allReleases.push(...(amazonMusicData.releases || []))
        platformStats.amazonMusic = {
          followers: amazonMusicData.artist?.followers || 0,
          name: amazonMusicData.artist?.name || "Amazon Music Artist",
          connected: true,
        }
      } else {
        errors.push(`Amazon Music: ${amazonMusicData.error || "Unknown error"}`)
        platformStats.amazonMusic = { connected: false }
      }
    } else {
      errors.push(`Amazon Music: Failed to fetch data. Status: ${amazonMusicRes.status}`)
      platformStats.amazonMusic = { connected: false }
    }

    // Sort releases by date, newest first
    allReleases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

    return NextResponse.json({
      success: true,
      releases: allReleases,
      platformStats,
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
