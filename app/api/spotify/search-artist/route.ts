import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let spotifyAccessToken: string | null = null
let tokenExpiryTime = 0

async function getSpotifyAccessToken() {
  if (spotifyAccessToken && Date.now() < tokenExpiryTime) {
    return spotifyAccessToken
  }

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
  spotifyAccessToken = data.access_token
  tokenExpiryTime = Date.now() + data.expires_in * 1000 - 60000 // Refresh 1 minute before expiry
  return spotifyAccessToken
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ success: false, error: "Query parameter is required." }, { status: 400 })
    }

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
      const errorData = await searchResponse.json()
      console.error("Spotify search API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to search Spotify artists: ${errorData.error?.message || searchResponse.statusText}`,
        },
        { status: searchResponse.status },
      )
    }

    const searchData = await searchResponse.json()
    const artists = searchData.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      followers: artist.followers.total,
      image: artist.images[0]?.url || "/placeholder.png",
      genres: artist.genres,
      popularity: artist.popularity,
      spotifyUrl: artist.external_urls.spotify,
    }))

    return NextResponse.json({ success: true, artists })
  } catch (error: any) {
    console.error("Spotify search artist API route error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
