import { NextResponse } from "next/server"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Spotify API keys are not set.")
  }
  const authOptions = {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  }

  const response = await fetch("https://accounts.spotify.com/api/token", authOptions)
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
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const accessToken = await getAccessToken()
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to search artists: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const artists = data.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      popularity: artist.popularity,
      image: artist.images[0]?.url || null,
      spotifyUrl: artist.external_urls.spotify,
    }))

    return NextResponse.json({ artists })
  } catch (error: any) {
    console.error("Spotify search artist API error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
