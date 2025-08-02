import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

async function getSpotifyAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return null
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
  const data = await response.json()
  return data.access_token
}

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_ARTIST_ID) {
    return NextResponse.json(
      { success: false, error: "Spotify credentials or Artist ID not configured" },
      { status: 400 },
    )
  }

  const accessToken = await getSpotifyAccessToken()
  if (!accessToken) {
    return NextResponse.json({ success: false, error: "Failed to get Spotify access token" }, { status: 500 })
  }

  try {
    // Fetch artist details
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const artistData = await artistResponse.json()

    if (!artistResponse.ok || artistData.error) {
      console.error("Spotify Artist API Error:", artistData.error)
      return NextResponse.json(
        { success: false, error: artistData.error?.message || "Failed to fetch Spotify artist data" },
        { status: artistResponse.status },
      )
    }

    const artistInfo = {
      name: artistData.name,
      followers: artistData.followers.total,
      image: artistData.images[0]?.url || "/placeholder.svg?height=200&width=200",
      genres: artistData.genres,
      popularity: artistData.popularity,
    }

    // Fetch artist's albums (including singles)
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    const albumsData = await albumsResponse.json()

    if (!albumsResponse.ok || albumsData.error) {
      console.error("Spotify Albums API Error:", albumsData.error)
      return NextResponse.json(
        { success: false, error: albumsData.error?.message || "Failed to fetch Spotify albums" },
        { status: albumsResponse.status },
      )
    }

    const releases = albumsData.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      platform: "Spotify",
      releaseDate: item.release_date,
      image: item.images[0]?.url || "/placeholder.svg?height=300&width=300",
      link: item.external_urls.spotify,
      type: item.album_type === "album" ? "Album" : "Single",
      streams: "N/A", // Spotify API does not expose public stream counts for albums/singles directly
    }))

    return NextResponse.json({ success: true, releases, artist: artistInfo })
  } catch (error) {
    console.error("Spotify API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch Spotify data" }, { status: 500 })
  }
}
