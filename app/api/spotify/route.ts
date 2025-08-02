import { NextResponse } from "next/server"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

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

async function getArtistData(accessToken: string) {
  if (!ARTIST_ID) {
    throw new Error("Spotify Artist ID is not set.")
  }
  const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, {
    headers: { Authorization: "Bearer " + accessToken },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get artist data: ${response.status} - ${errorText}`)
  }
  return response.json()
}

async function getArtistAlbums(accessToken: string) {
  if (!ARTIST_ID) {
    throw new Error("Spotify Artist ID is not set.")
  }
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&limit=10`,
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  )
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get artist albums: ${response.status} - ${errorText}`)
  }
  return response.json()
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()
    const [artistData, albumsData] = await Promise.all([getArtistData(accessToken), getArtistAlbums(accessToken)])

    const releases = albumsData.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      platform: "Spotify",
      releaseDate: album.release_date,
      streams: "N/A", // Spotify API doesn't directly provide stream counts for albums/singles
      image: album.images[0]?.url || "/placeholder.png",
      link: album.external_urls.spotify,
      type: album.album_type === "album" ? "Album" : "Single",
      artists: album.artists.map((artist: any) => artist.name).join(", "),
      isNew: new Date(album.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // New if released in last 30 days
    }))

    const platformStats = {
      spotify: {
        followers: artistData.followers.total,
        name: artistData.name,
        connected: true,
        monthlyListeners: 0, // Spotify API does not provide monthly listeners directly
      },
    }

    const artistInfo = {
      name: artistData.name,
      followers: artistData.followers.total,
      image: artistData.images[0]?.url || "/placeholder-user.jpg",
      genres: artistData.genres,
      popularity: artistData.popularity,
      spotifyUrl: artistData.external_urls.spotify,
    }

    return NextResponse.json({ releases, platformStats, artistData: artistInfo })
  } catch (error: any) {
    console.error("Spotify API error:", error.message)
    return NextResponse.json(
      {
        releases: [],
        platformStats: { spotify: { connected: false, error: error.message } },
        artistData: null,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
