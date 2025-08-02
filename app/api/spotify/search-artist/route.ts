import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

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
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
      { headers },
    )

    if (!searchRes.ok) {
      const errorData = await searchRes.json()
      console.error("Spotify search error:", errorData)
      return NextResponse.json({ error: errorData.error?.message || "Failed to search Spotify" }, { status: 500 })
    }

    const data = await searchRes.json()
    const artists = data.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      followers: artist.followers.total,
      popularity: artist.popularity,
      image: artist.images[0]?.url || "/placeholder.svg?height=64&width=64",
      genres: artist.genres,
    }))

    return NextResponse.json({ artists })
  } catch (error: any) {
    console.error("Spotify Search API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
