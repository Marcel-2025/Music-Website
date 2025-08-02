import { NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID

async function getSpotifyAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing Spotify credentials")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Spotify auth failed: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testArtistId = searchParams.get("artistId")
    const artistId = testArtistId || SPOTIFY_ARTIST_ID

    if (!artistId) {
      return NextResponse.json(
        {
          error: "Spotify Artist ID not configured",
          message: "Please add your SPOTIFY_ARTIST_ID to environment variables",
        },
        { status: 400 },
      )
    }

    const accessToken = await getSpotifyAccessToken()

    // Get artist's albums and singles
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=US&limit=50&offset=0`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    )

    if (!albumsResponse.ok) {
      const error = await albumsResponse.text()
      throw new Error(`Failed to fetch albums: ${error}`)
    }

    const albumsData = await albumsResponse.json()

    // Get artist info
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!artistResponse.ok) {
      const error = await artistResponse.text()
      throw new Error(`Failed to fetch artist info: ${error}`)
    }

    const artistData = await artistResponse.json()

    // Format the releases
    const releases = albumsData.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      platform: "Spotify",
      platformIcon: "Spotify",
      releaseDate: album.release_date,
      streams: `${album.total_tracks} tracks`,
      image: album.images[0]?.url || "/placeholder.svg?height=300&width=300",
      link: album.external_urls.spotify,
      type: album.album_type === "single" ? "Single" : album.album_type === "album" ? "Album" : "EP",
      totalTracks: album.total_tracks,
      artists: album.artists.map((artist: any) => artist.name).join(", "),
    }))

    return NextResponse.json({
      success: true,
      releases,
      artist: {
        name: artistData.name,
        followers: artistData.followers.total,
        image: artistData.images[0]?.url,
        genres: artistData.genres,
        popularity: artistData.popularity,
        externalUrls: artistData.external_urls,
      },
      totalReleases: releases.length,
    })
  } catch (error) {
    console.error("Spotify API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Spotify data",
        details: error instanceof Error ? error.message : "Unknown error",
        configured: {
          clientId: !!SPOTIFY_CLIENT_ID,
          clientSecret: !!SPOTIFY_CLIENT_SECRET,
          artistId: !!SPOTIFY_ARTIST_ID,
        },
      },
      { status: 500 },
    )
  }
}
