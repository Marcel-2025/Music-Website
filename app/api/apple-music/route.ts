import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch Spotify data and mirror it for Apple Music
    const spotifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify`)

    if (!spotifyResponse.ok) {
      throw new Error("Failed to fetch Spotify data")
    }

    const spotifyData = await spotifyResponse.json()

    // Convert Spotify releases to Apple Music format
    const appleMusicReleases = spotifyData.releases.map((release: any) => ({
      ...release,
      platform: "Apple Music",
      link: "https://music.apple.com/us/artist/ehhm-s/1813716914/see-all?section=singles",
    }))

    return NextResponse.json({
      connected: true,
      releases: appleMusicReleases,
      stats: {
        followers: spotifyData.stats?.followers || 0,
        name: spotifyData.stats?.name || "Ehhm.s",
      },
    })
  } catch (error) {
    console.error("Apple Music API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Apple Music data",
        connected: false,
        releases: [],
      },
      { status: 500 },
    )
  }
}
