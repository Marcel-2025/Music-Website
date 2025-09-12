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
    throw new Error(`Failed to get Spotify access token: ${response.status} - ${errorText}`)
  }
  const data = await response.json()
  return data.access_token
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ success: false, message: "Query parameter is required." }, { status: 400 })
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ success: false, message: "Spotify API keys are not configured." }, { status: 400 })
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      throw new Error(`Spotify search API error: ${searchResponse.status} - ${errorText}`)
    }

    const searchData = await searchResponse.json()
    const artists = searchData.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      popularity: artist.popularity,
      image: artist.images[0]?.url || null,
    }))

    return NextResponse.json({ success: true, artists })
  } catch (error: any) {
    console.error("Spotify search artist error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to search Spotify artists." },
      { status: 500 },
    )
  }
}
