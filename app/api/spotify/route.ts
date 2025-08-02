import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

async function getSpotifyAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify API credentials are not set.")
  }

  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Spotify token error:", errorData)
    throw new Error(`Failed to get Spotify access token: ${errorData.error_description || response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testMode = searchParams.get("test") === "true"
  const testArtistId = searchParams.get("artistId")

  const currentArtistId = testArtistId || SPOTIFY_ARTIST_ID

  if (!currentArtistId && !testMode) {
    return NextResponse.json({
      success: false,
      error: "Spotify Artist ID is not configured.",
      releases: [],
      artist: null,
    })
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }

    let artistData = null
    if (currentArtistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${currentArtistId}`, { headers })
      if (artistRes.ok) {
        artistData = await artistRes.json()
      } else {
        console.warn(`Could not fetch Spotify artist data for ID ${currentArtistId}: ${artistRes.statusText}`)
      }
    }

    let releases = []
    if (currentArtistId) {
      const albumsRes = await fetch(
        `https://api.spotify.com/v1/artists/${currentArtistId}/albums?include_groups=album,single,compilation&limit=20`,
        { headers },
      )

      if (albumsRes.ok) {
        const albumsData = await albumsRes.json()
        releases = albumsData.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          platform: "Spotify",
          releaseDate: item.release_date,
          image: item.images[0]?.url || "/placeholder.svg?height=300&width=300",
          link: item.external_urls.spotify,
          type: item.album_type === "album" ? "Album" : "Single",
          streams: "N/A", // Spotify API doesn't provide public stream counts directly for albums/singles
        }))
      } else {
        console.warn(`Could not fetch Spotify albums for artist ID ${currentArtistId}: ${albumsRes.statusText}`)
      }
    }

    return NextResponse.json({
      success: true,
      releases,
      artist: artistData
        ? {
            name: artistData.name,
            followers: artistData.followers.total,
            image: artistData.images[0]?.url || "/placeholder.svg?height=200&width=200",
            genres: artistData.genres,
            popularity: artistData.popularity,
          }
        : null,
      totalReleases: releases.length,
    })
  } catch (error: any) {
    console.error("Spotify API Error:", error.message)
    return NextResponse.json({ success: false, error: error.message, releases: [], artist: null }, { status: 500 })
  }
}
