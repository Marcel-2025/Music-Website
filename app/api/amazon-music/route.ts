import { NextResponse } from "next/server"

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Fetch Spotify data first
    const spotifyResponse = await fetch(`${baseUrl}/api/spotify`, {
      cache: "no-store",
    })

    if (!spotifyResponse.ok) {
      throw new Error(`Spotify API returned ${spotifyResponse.status}`)
    }

    const spotifyData = await spotifyResponse.json()

    if (!spotifyData.success) {
      throw new Error("Spotify data not available")
    }

    // Convert Spotify releases to Amazon Music format
    const amazonMusicReleases = spotifyData.releases.map((release: any) => ({
      ...release,
      platform: "Amazon Music",
      link: "https://music.amazon.de/browse/music-items/artist/B0F89B4G8H/chronological-albums",
    }))

    return NextResponse.json({
      success: true,
      connected: true,
      releases: amazonMusicReleases,
      stats: {
        followers: spotifyData.artist?.followers || 0,
        name: spotifyData.artist?.name || "Ehhm.s",
      },
    })
  } catch (error: any) {
    console.error("Amazon Music API Error:", error)
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message || "Failed to fetch Amazon Music data",
        releases: [],
      },
      { status: 500 },
    )
  }
}
