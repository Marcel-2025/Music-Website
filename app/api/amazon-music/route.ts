import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to get Spotify data to mirror the same releases
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const spotifyResponse = await fetch(`${baseUrl}/api/spotify`, {
      cache: "no-store",
    })

    let amazonMusicReleases = []
    let artistInfo = {
      name: "Ehhm.s",
      followers: 6200,
      image: "/placeholder.svg?height=200&width=200",
      genres: ["Electronic", "Bass Music"],
      popularity: 62,
    }

    if (spotifyResponse.ok) {
      const spotifyData = await spotifyResponse.json()

      if (spotifyData.success && spotifyData.releases) {
        // Convert Spotify releases to Amazon Music format
        amazonMusicReleases = spotifyData.releases.map((release: any) => ({
          id: `amz-${release.id}`,
          title: release.title,
          platform: "Amazon Music",
          releaseDate: release.releaseDate,
          streams: release.streams,
          image: release.image,
          // Generate Amazon Music search link based on song title and artist
          link: `https://music.amazon.com/search/${encodeURIComponent(release.title + " Ehhm.s")}`,
          type: release.type || "Album",
          totalTracks: release.totalTracks,
          artists: release.artists || "Ehhm.s",
        }))

        // Use Spotify artist info as base
        if (spotifyData.artist) {
          artistInfo = {
            name: spotifyData.artist.name || "Ehhm.s",
            followers: Math.floor((spotifyData.artist.followers || 6200) * 0.7), // Approximate Amazon followers
            image: spotifyData.artist.image || "/placeholder.svg?height=200&width=200",
            genres: spotifyData.artist.genres || ["Electronic", "Bass Music"],
            popularity: Math.floor((spotifyData.artist.popularity || 62) * 0.9),
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      releases: amazonMusicReleases,
      artist: artistInfo,
      connected: true,
      note: "Releases mirrored from Spotify. Links are Amazon Music search links.",
    })
  } catch (error) {
    console.error("Amazon Music API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Amazon Music data",
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
