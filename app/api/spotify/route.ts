import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

async function getSpotifyAccessToken() {
  console.log("Getting Spotify access token...")
  console.log("Client ID exists:", !!SPOTIFY_CLIENT_ID)
  console.log("Client Secret exists:", !!SPOTIFY_CLIENT_SECRET)

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials are missing")
  }

  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")

  console.log("Making request to Spotify token endpoint...")

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const responseText = await response.text()
  console.log("Spotify token response status:", response.status)
  console.log("Spotify token response:", responseText)

  if (!response.ok) {
    console.error("Failed to get Spotify access token:", response.status, responseText)
    throw new Error(`Failed to get Spotify access token: ${response.status} ${responseText}`)
  }

  const data = JSON.parse(responseText)
  return data.access_token
}

export async function GET() {
  console.log("Spotify API route called")
  console.log("Environment variables check:")
  console.log("SPOTIFY_CLIENT_ID:", SPOTIFY_CLIENT_ID ? "Set" : "Missing")
  console.log("SPOTIFY_CLIENT_SECRET:", SPOTIFY_CLIENT_SECRET ? "Set" : "Missing")
  console.log("SPOTIFY_ARTIST_ID:", SPOTIFY_ARTIST_ID ? "Set" : "Missing")

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_ARTIST_ID) {
    return NextResponse.json(
      {
        error: "Spotify API credentials or artist ID not set",
        details: {
          clientId: !!SPOTIFY_CLIENT_ID,
          clientSecret: !!SPOTIFY_CLIENT_SECRET,
          artistId: !!SPOTIFY_ARTIST_ID,
        },
      },
      { status: 400 },
    )
  }

  try {
    const accessToken = await getSpotifyAccessToken()
    console.log("Successfully got access token")

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Spotify API request failed:", response.status, errorText)
      throw new Error(`Spotify API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const releases = data.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist: any) => artist.name).join(", "),
      releaseDate: item.release_date,
      imageUrl: item.images[0]?.url || "/placeholder.svg",
      platform: "spotify",
      url: item.external_urls.spotify,
    }))

    return NextResponse.json({ releases })
  } catch (error) {
    console.error("Error fetching Spotify releases:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Spotify releases",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
