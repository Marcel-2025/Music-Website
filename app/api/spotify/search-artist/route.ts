import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

async function getSpotifyAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artistName = searchParams.get("q") || "Ehhm.s"

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({ error: "Spotify credentials not configured" }, { status: 400 })
    }

    const accessToken = await getSpotifyAccessToken()

    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const searchData = await searchResponse.json()

    const artists = searchData.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      followers: artist.followers.total,
      genres: artist.genres,
      popularity: artist.popularity,
      image: artist.images[0]?.url,
      spotifyUrl: artist.external_urls.spotify,
    }))

    return NextResponse.json({
      query: artistName,
      artists,
      message: artists.length > 0 ? "Found artists matching your search" : "No artists found",
    })
  } catch (error) {
    console.error("Spotify Search Error:", error)
    return NextResponse.json({ error: "Failed to search artists" }, { status: 500 })
  }
}
