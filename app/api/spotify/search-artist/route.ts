import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json(
      { success: false, error: "Spotify Client ID or Client Secret not configured" },
      { status: 400 },
    )
  }

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
  }

  const accessToken = await getSpotifyAccessToken()
  if (!accessToken) {
    return NextResponse.json({ success: false, error: "Failed to get Spotify access token" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    const data = await response.json()

    if (!response.ok || data.error) {
      console.error("Spotify Search API Error:", data.error)
      return NextResponse.json(
        { success: false, error: data.error?.message || "Failed to search Spotify artists" },
        { status: response.status },
      )
    }

    const artists = data.artists.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      genres: item.genres,
      popularity: item.popularity,
      image: item.images[0]?.url || "/placeholder.svg?height=48&width=48",
    }))

    return NextResponse.json({ success: true, artists })
  } catch (error) {
    console.error("Spotify Search API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to search Spotify artists" }, { status: 500 })
  }
}
