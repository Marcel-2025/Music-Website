import { NextResponse } from "next/server"

export async function GET() {
  const releases = []
  const platformStats = {
    spotify: { connected: false, followers: 0, name: "Spotify" },
    youtube: { connected: false, subscribers: 0, videoCount: 0, name: "YouTube" },
    appleMusic: { connected: false, followers: 0, name: "Apple Music" },
    amazonMusic: { connected: false, followers: 0, name: "Amazon Music" },
  }
  const artistData = {
    name: "Ehhm.s",
    followers: 0,
    image: "/placeholder-user.jpg",
    genres: [],
    popularity: 0,
  }
  const errors = []

  // Fetch Spotify data
  try {
    const spotifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`)
    if (!spotifyRes.ok) {
      const errorText = await spotifyRes.text()
      throw new Error(`Spotify API error: ${errorText}`)
    }
    const spotifyData = await spotifyRes.json()
    if (spotifyData.success) {
      releases.push(...spotifyData.releases)
      platformStats.spotify = { ...spotifyData.platformStats, connected: true }
      artistData.followers += spotifyData.platformStats.followers
      artistData.image = spotifyData.artistData.image || artistData.image
      artistData.genres = [...new Set([...artistData.genres, ...spotifyData.artistData.genres])]
      artistData.popularity = spotifyData.artistData.popularity
    } else {
      platformStats.spotify.error = spotifyData.message || "Unknown Spotify error"
    }
  } catch (error: any) {
    console.error("Error fetching Spotify data:", error)
    platformStats.spotify.error = error.message || "Failed to fetch Spotify data"
    errors.push(`Spotify: ${error.message || "Failed to fetch"}`)
  }

  // Fetch YouTube data
  try {
    const youtubeRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube`)
    if (!youtubeRes.ok) {
      const errorText = await youtubeRes.text()
      throw new Error(`YouTube API error: ${errorText}`)
    }
    const youtubeData = await youtubeRes.json()
    if (youtubeData.success) {
      releases.push(...youtubeData.releases)
      platformStats.youtube = { ...youtubeData.platformStats, connected: true }
      artistData.followers += youtubeData.platformStats.subscribers
    } else {
      platformStats.youtube.error = youtubeData.message || "Unknown YouTube error"
    }
  } catch (error: any) {
    console.error("Error fetching YouTube data:", error)
    platformStats.youtube.error = error.message || "Failed to fetch YouTube data"
    errors.push(`YouTube: ${error.message || "Failed to fetch"}`)
  }

  // Fetch Apple Music data (placeholder)
  try {
    const appleMusicRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apple-music`)
    if (!appleMusicRes.ok) {
      const errorText = await appleMusicRes.text()
      throw new Error(`Apple Music API error: ${errorText}`)
    }
    const appleMusicData = await appleMusicRes.json()
    if (appleMusicData.success) {
      releases.push(...appleMusicData.releases)
      platformStats.appleMusic = { ...appleMusicData.platformStats, connected: true }
      artistData.followers += appleMusicData.platformStats.followers
    } else {
      platformStats.appleMusic.error = appleMusicData.message || "Unknown Apple Music error"
    }
  } catch (error: any) {
    console.error("Error fetching Apple Music data:", error)
    platformStats.appleMusic.error = error.message || "Failed to fetch Apple Music data"
    errors.push(`Apple Music: ${error.message || "Failed to fetch"}`)
  }

  // Fetch Amazon Music data (placeholder)
  try {
    const amazonMusicRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/amazon-music`)
    if (!amazonMusicRes.ok) {
      const errorText = await amazonMusicRes.text()
      throw new Error(`Amazon Music API error: ${errorText}`)
    }
    const amazonMusicData = await amazonMusicRes.json()
    if (amazonMusicData.success) {
      releases.push(...amazonMusicData.releases)
      platformStats.amazonMusic = { ...amazonMusicData.platformStats, connected: true }
      artistData.followers += amazonMusicData.platformStats.followers
    } else {
      platformStats.amazonMusic.error = amazonMusicData.message || "Unknown Amazon Music error"
    }
  } catch (error: any) {
    console.error("Error fetching Amazon Music data:", error)
    platformStats.amazonMusic.error = error.message || "Failed to fetch Amazon Music data"
    errors.push(`Amazon Music: ${error.message || "Failed to fetch"}`)
  }

  // Sort releases by releaseDate (newest first)
  releases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

  if (errors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Errors occurred while fetching data: ${errors.join("; ")}`,
        releases,
        platformStats,
        artistData,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true, releases, platformStats, artistData })
}
