import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

async function getSpotifyAccessToken() {
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
    const errorText = await response.text()
    throw new Error(`Failed to get Spotify access token: ${response.status} - ${errorText}`)
  }
  const data = await response.json()
  return data.access_token
}

async function getArtistAlbums(accessToken: string, artistId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get artist albums: ${response.status} - ${errorText}`)
  }
  return response.json()
}

async function getArtistInfo(accessToken: string, artistId: string) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get artist info: ${response.status} - ${errorText}`)
  }
  return response.json()
}

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_ARTIST_ID) {
    return NextResponse.json(
      {
        success: false,
        message: "Spotify API keys or Artist ID are not configured.",
        platformStats: { spotify: { connected: false, error: "Missing API keys or Artist ID" } },
      },
      { status: 400 },
    )
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const [albumsData, artistData] = await Promise.all([
      getArtistAlbums(accessToken, SPOTIFY_ARTIST_ID),
      getArtistInfo(accessToken, SPOTIFY_ARTIST_ID),
    ])

    const releases = albumsData.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      platform: "Spotify",
      releaseDate: album.release_date,
      streams: "N/A", // Spotify API doesn't directly provide stream counts for albums/singles
      image: album.images[0]?.url || "/placeholder.png?height=300&width=300&query=spotify album cover",
      link: album.external_urls.spotify,
      type: album.album_type === "album" ? "Album" : album.album_type === "single" ? "Single" : "Compilation",
      totalTracks: album.total_tracks,
      artists: album.artists.map((artist: any) => artist.name).join(", "),
    }))

    return NextResponse.json({
      success: true,
      releases,
      platformStats: {
        spotify: {
          followers: artistData.followers.total,
          name: artistData.name,
          connected: true,
        },
      },
      artistData: {
        name: artistData.name,
        followers: artistData.followers.total,
        image: artistData.images[0]?.url || "/placeholder-user.png",
        genres: artistData.genres,
        popularity: artistData.popularity,
        spotifyUrl: artistData.external_urls.spotify,
      },
    })
  } catch (error: any) {
    console.error("Spotify API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch Spotify data.",
        platformStats: { spotify: { connected: false, error: error.message || "API Error" } },
      },
      { status: 500 },
    )
  }
}
