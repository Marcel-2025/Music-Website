import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

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
    console.error("Failed to get Spotify access token:", response.status, errorText)
    throw new Error(`Failed to get Spotify access token: ${response.statusText}`)
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

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: "Spotify API credentials not set" }, { status: 400 })
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Spotify search API request failed:", response.status, errorText)
      throw new Error(`Spotify search API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const artists = data.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || "/placeholder.svg",
    }))

    return NextResponse.json({ artists })
  } catch (error) {
    console.error("Error searching Spotify artists:", error)
    return NextResponse.json({ error: "Failed to search Spotify artists" }, { status: 500 })
  }
}
