import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const APPLE_MUSIC_PRIVATE_KEY = process.env.APPLE_MUSIC_PRIVATE_KEY
const APPLE_MUSIC_KEY_ID = process.env.APPLE_MUSIC_KEY_ID
const APPLE_MUSIC_TEAM_ID = process.env.APPLE_MUSIC_TEAM_ID
const APPLE_MUSIC_ARTIST_ID = process.env.APPLE_MUSIC_ARTIST_ID

function generateAppleMusicToken() {
  const payload = {
    iss: APPLE_MUSIC_TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60, // 6 months
  }

  return jwt.sign(payload, APPLE_MUSIC_PRIVATE_KEY!, {
    algorithm: "ES256",
    header: {
      kid: APPLE_MUSIC_KEY_ID,
    },
  })
}

export async function GET() {
  try {
    const token = generateAppleMusicToken()

    // Get artist's albums
    const response = await fetch(`https://api.music.apple.com/v1/catalog/us/artists/${APPLE_MUSIC_ARTIST_ID}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Music-User-Token": "", // Optional: for user-specific data
      },
    })

    const data = await response.json()

    return NextResponse.json({
      releases:
        data.data?.map((album: any) => ({
          id: album.id,
          title: album.attributes.name,
          platform: "Apple Music",
          releaseDate: album.attributes.releaseDate,
          image: album.attributes.artwork.url.replace("{w}x{h}", "300x300"),
          link: album.attributes.url,
          type: album.attributes.isSingle ? "Single" : "Album",
          trackCount: album.attributes.trackCount,
        })) || [],
    })
  } catch (error) {
    console.error("Apple Music API Error:", error)
    return NextResponse.json({ error: "Failed to fetch Apple Music data" }, { status: 500 })
  }
}
