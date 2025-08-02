import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

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

export async function GET() {
  try {
    if (!SPOTIFY_ARTIST_ID) {
      return NextResponse.json({ success: false, error: "SPOTIFY_ARTIST_ID is not configured." }, { status: 400 })
    }

    const accessToken = await getSpotifyAccessToken()

    // Fetch artist data
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!artistResponse.ok) {
      const errorData = await artistResponse.json()
      console.error("Spotify artist API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch Spotify artist data: ${errorData.error?.message || artistResponse.statusText}`,
        },
        { status: artistResponse.status },
      )
    }
    const artistData = await artistResponse.json()

    // Fetch artist's albums (including singles and EPs)
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single,compilation,appears_on&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!albumsResponse.ok) {
      const errorData = await albumsResponse.json()
      console.error("Spotify albums API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch Spotify albums: ${errorData.error?.message || albumsResponse.statusText}`,
        },
        { status: albumsResponse.status },
      )
    }
    const albumsData = await albumsResponse.json()

    const releases = albumsData.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      platform: "Spotify",
      releaseDate: album.release_date,
      streams: "N/A", // Spotify API doesn't provide total streams for albums/singles directly
      image: album.images[0]?.url || "/placeholder.png",
      link: album.external_urls.spotify,
      type: album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1), // Album, Single, EP
      artists: album.artists.map((artist: any) => artist.name).join(", "),
    }))

    return NextResponse.json({
      success: true,
      artist: {
        id: artistData.id,
        name: artistData.name,
        followers: artistData.followers.total,
        image: artistData.images[0]?.url || "/placeholder.png",
        genres: artistData.genres,
        popularity: artistData.popularity,
        spotifyUrl: artistData.external_urls.spotify,
      },
      releases: releases,
      totalReleases: releases.length,
    })
  } catch (error: any) {
    console.error("Spotify API route error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
