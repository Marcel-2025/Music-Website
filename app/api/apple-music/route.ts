import { NextResponse } from "next/server"

// Apple Music API credentials (optional for future real API integration)
const APPLE_MUSIC_TEAM_ID = process.env.APPLE_MUSIC_TEAM_ID
const APPLE_MUSIC_KEY_ID = process.env.APPLE_MUSIC_KEY_ID
const APPLE_MUSIC_PRIVATE_KEY = process.env.APPLE_MUSIC_PRIVATE_KEY

export async function GET() {
  try {
    // First, try to get Spotify data to mirror the same releases
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const spotifyResponse = await fetch(`${baseUrl}/api/spotify`, {
      cache: "no-store",
    })

    let appleMusicReleases = []
    let artistInfo = {
      name: "Ehhm.s",
      followers: 8500,
      image: "/placeholder.svg?height=200&width=200",
      genres: ["Electronic", "Synthwave", "Ambient"],
      popularity: 68,
    }

    if (spotifyResponse.ok) {
      const spotifyData = await spotifyResponse.json()

      if (spotifyData.success && spotifyData.releases) {
        // Convert Spotify releases to Apple Music format
        // All links point to the artist profile on Apple Music
        appleMusicReleases = spotifyData.releases.map((release: any) => ({
          id: `am-${release.id}`,
          title: release.title,
          platform: "Apple Music",
          releaseDate: release.releaseDate,
          streams: release.streams,
          image: release.image,
          link: "https://music.apple.com/us/artist/ehhm-s/1813716914/see-all?section=singles",
          type: release.type || "Album",
          totalTracks: release.totalTracks,
          artists: release.artists || "Ehhm.s",
        }))

        // Use Spotify artist info as base
        if (spotifyData.artist) {
          artistInfo = {
            name: spotifyData.artist.name || "Ehhm.s",
            followers: spotifyData.artist.followers || 8500,
            image: spotifyData.artist.image || "/placeholder.svg?height=200&width=200",
            genres: spotifyData.artist.genres || ["Electronic", "Synthwave"],
            popularity: spotifyData.artist.popularity || 68,
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      releases: appleMusicReleases,
      artist: artistInfo,
      connected: true,
      note: "Releases mirrored from Spotify. All links point to Apple Music artist profile.",
    })
  } catch (error) {
    console.error("Apple Music API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Apple Music data",
        releases: [],
        artist: {
          name: "Ehhm.s",
          followers: 0,
          image: "/placeholder.svg?height=200&width=200",
          genres: [],
          popularity: 0,
        },
        connected: false,
      },
      { status: 500 },
    )
  }
}
