import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Environment variables for Apple Music API
const APPLE_MUSIC_PRIVATE_KEY = process.env.APPLE_MUSIC_PRIVATE_KEY
const APPLE_MUSIC_KEY_ID = process.env.APPLE_MUSIC_KEY_ID
const APPLE_MUSIC_TEAM_ID = process.env.APPLE_MUSIC_TEAM_ID
const APPLE_MUSIC_ARTIST_ID = process.env.APPLE_MUSIC_ARTIST_ID

// Function to generate a developer token
function generateDeveloperToken() {
  if (!APPLE_MUSIC_PRIVATE_KEY || !APPLE_MUSIC_KEY_ID || !APPLE_MUSIC_TEAM_ID) {
    return null
  }

  const header = {
    alg: "ES256",
    kid: APPLE_MUSIC_KEY_ID,
  }

  const payload = {
    iss: APPLE_MUSIC_TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token valid for 1 hour
  }

  // Sign the token
  const token = jwt.sign(payload, APPLE_MUSIC_PRIVATE_KEY, { header })
  return token
}

export async function GET() {
  if (!APPLE_MUSIC_PRIVATE_KEY || !APPLE_MUSIC_KEY_ID || !APPLE_MUSIC_TEAM_ID || !APPLE_MUSIC_ARTIST_ID) {
    return NextResponse.json(
      { success: false, error: "Apple Music API credentials or Artist ID not configured" },
      { status: 400 },
    )
  }

  const developerToken = generateDeveloperToken()

  if (!developerToken) {
    return NextResponse.json(
      { success: false, error: "Failed to generate Apple Music developer token" },
      { status: 500 },
    )
  }

  try {
    // Fetch artist details (Apple Music API doesn't directly provide follower count)
    // We'll use a placeholder for followers for now or derive it from other metrics if possible.
    const artistResponse = await fetch(`https://api.music.apple.com/v1/catalog/us/artists/${APPLE_MUSIC_ARTIST_ID}`, {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Music-User-Token": "", // User token is not needed for catalog data
      },
    })
    const artistData = await artistResponse.json()

    if (!artistResponse.ok || artistData.errors) {
      console.error("Apple Music Artist API Error:", artistData.errors)
      return NextResponse.json(
        { success: false, error: artistData.errors?.[0]?.detail || "Failed to fetch Apple Music artist data" },
        { status: artistResponse.status },
      )
    }

    const artist = artistData.data[0]
    const artistInfo = {
      name: artist.attributes.name,
      followers: 0, // Apple Music API does not expose public follower counts
      image:
        artist.attributes.artwork?.url.replace("{w}", "300").replace("{h}", "300") ||
        "/placeholder.svg?height=300&width=300",
      genres: artist.attributes.genreNames || [],
    }

    // Fetch latest albums/singles from the artist
    const albumsResponse = await fetch(
      `https://api.music.apple.com/v1/catalog/us/artists/${APPLE_MUSIC_ARTIST_ID}/albums?limit=10&sort=releaseDate`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": "",
        },
      },
    )
    const albumsData = await albumsResponse.json()

    if (!albumsResponse.ok || albumsData.errors) {
      console.error("Apple Music Albums API Error:", albumsData.errors)
      return NextResponse.json(
        { success: false, error: albumsData.errors?.[0]?.detail || "Failed to fetch Apple Music albums" },
        { status: albumsResponse.status },
      )
    }

    const releases = albumsData.data.map((item: any) => ({
      id: item.id,
      title: item.attributes.name,
      platform: "Apple Music",
      releaseDate: item.attributes.releaseDate,
      image:
        item.attributes.artwork?.url.replace("{w}", "300").replace("{h}", "300") ||
        "/placeholder.svg?height=300&width=300",
      link: item.attributes.url,
      type: item.attributes.albumProductionType || item.type,
      streams: "N/A", // Apple Music API does not expose public stream counts
    }))

    return NextResponse.json({ success: true, releases, artist: artistInfo })
  } catch (error) {
    console.error("Apple Music API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch Apple Music data" }, { status: 500 })
  }
}
