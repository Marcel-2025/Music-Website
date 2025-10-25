import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch Spotify data and mirror it for Amazon Music
    const spotifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify`)

    if (!spotifyResponse.ok) {
      throw new Error("Failed to fetch Spotify data")
    }

    const spotifyData = await spotifyResponse.json()

    // Convert Spotify releases to Amazon Music format
    const amazonMusicReleases = spotifyData.releases.map((release: any) => ({
      ...release,
      platform: "Amazon Music",
      link: "https://music.amazon.de/browse/music-items/artist/B0F89B4G8H/chronological-albums",
    }))

    return NextResponse.json({
      connected: true,
      releases: amazonMusicReleases,
      stats: {
        followers: spotifyData.stats?.followers || 0,
        name: spotifyData.stats?.name || "Ehhm.s",
      },
    })
  } catch (error) {
    console.error("Amazon Music API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Amazon Music data",
        connected: false,
        releases: [],
      },
      { status: 500 },
    )
  }
}
