import { NextResponse } from "next/server"

export async function GET() {
  try {
    const releases = []
    const platformStats: any = {}

    // Fetch Spotify data
    try {
      const spotifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify`, {
        cache: "no-store",
      })
      const spotifyData = await spotifyRes.json()

      if (spotifyData.success && spotifyData.releases) {
        releases.push(...spotifyData.releases)
        platformStats.spotify = {
          followers: spotifyData.artist?.followers || 0,
          name: spotifyData.artist?.name || "Spotify",
          connected: true,
        }
      }
    } catch (error) {
      console.error("Spotify fetch error:", error)
      platformStats.spotify = { connected: false }
    }

    // Fetch YouTube data
    try {
      const youtubeRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/youtube`, {
        cache: "no-store",
      })
      const youtubeData = await youtubeRes.json()

      if (youtubeData.success && youtubeData.releases) {
        releases.push(...youtubeData.releases)
        platformStats.youtube = {
          subscribers: youtubeData.channel?.subscribers || 0,
          videoCount: youtubeData.channel?.videoCount || 0,
          name: youtubeData.channel?.name || "YouTube",
          connected: true,
        }
      }
    } catch (error) {
      console.error("YouTube fetch error:", error)
      platformStats.youtube = { connected: false }
    }

    // Fetch Apple Music data
    try {
      const appleMusicRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/apple-music`,
        {
          cache: "no-store",
        },
      )
      const appleMusicData = await appleMusicRes.json()

      if (appleMusicData.success && appleMusicData.releases) {
        releases.push(...appleMusicData.releases)
        platformStats.appleMusic = {
          followers: appleMusicData.stats?.followers || 0,
          name: appleMusicData.stats?.name || "Apple Music",
          connected: true,
        }
      }
    } catch (error) {
      console.error("Apple Music fetch error:", error)
      platformStats.appleMusic = { connected: false }
    }

    // Fetch Amazon Music data
    try {
      const amazonMusicRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/amazon-music`,
        {
          cache: "no-store",
        },
      )
      const amazonMusicData = await amazonMusicRes.json()

      if (amazonMusicData.success && amazonMusicData.releases) {
        releases.push(...amazonMusicData.releases)
        platformStats.amazonMusic = {
          followers: amazonMusicData.stats?.followers || 0,
          name: amazonMusicData.stats?.name || "Amazon Music",
          connected: true,
        }
      }
    } catch (error) {
      console.error("Amazon Music fetch error:", error)
      platformStats.amazonMusic = { connected: false }
    }

    return NextResponse.json({
      releases,
      platformStats,
      success: true,
    })
  } catch (error) {
    console.error("Releases API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch releases",
        releases: [],
        platformStats: {},
      },
      { status: 500 },
    )
  }
}
