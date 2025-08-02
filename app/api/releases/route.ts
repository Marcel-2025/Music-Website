import { NextResponse } from "next/server"

// Helper function to fetch data and handle errors
async function fetchData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    })

    if (!response.ok) {
      const errorText = await response.text() // Read as text to avoid JSON parsing error
      console.error(`Error fetching from ${url}: ${response.status} ${response.statusText} - ${errorText}`)
      return { success: false, data: null, error: `Failed to fetch from ${url}: ${response.statusText}` }
    }

    const data = await response.json()
    return { success: true, data, error: null }
  } catch (error: any) {
    console.error(`Exception fetching from ${url}:`, error)
    return { success: false, data: null, error: `Network error or invalid response from ${url}: ${error.message}` }
  }
}

export async function GET() {
  const spotifyPromise = fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`)
  const youtubePromise = fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube`)
  const appleMusicPromise = fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apple-music`)
  const amazonMusicPromise = fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/amazon-music`)

  const [spotifyRes, youtubeRes, appleMusicRes, amazonMusicRes] = await Promise.all([
    spotifyPromise,
    youtubePromise,
    appleMusicPromise,
    amazonMusicPromise,
  ])

  const allReleases: any[] = []
  const platformStats: { [key: string]: any } = {}
  let artistData: any = null
  const errors: string[] = []

  // Process Spotify data
  if (spotifyRes.success && spotifyRes.data) {
    allReleases.push(...(spotifyRes.data.releases || []))
    platformStats.spotify = spotifyRes.data.platformStats?.spotify || { connected: false }
    if (spotifyRes.data.artistData) {
      artistData = { ...artistData, ...spotifyRes.data.artistData }
    }
  } else {
    errors.push(spotifyRes.error || "Spotify data fetch failed.")
    platformStats.spotify = { connected: false, error: spotifyRes.error }
  }

  // Process YouTube data
  if (youtubeRes.success && youtubeRes.data) {
    allReleases.push(...(youtubeRes.data.releases || []))
    platformStats.youtube = youtubeRes.data.platformStats?.youtube || { connected: false }
    if (youtubeRes.data.artistData) {
      artistData = { ...artistData, ...youtubeRes.data.artistData }
    }
  } else {
    errors.push(youtubeRes.error || "YouTube data fetch failed.")
    platformStats.youtube = { connected: false, error: youtubeRes.error }
  }

  // Process Apple Music data
  if (appleMusicRes.success && appleMusicRes.data) {
    allReleases.push(...(appleMusicRes.data.releases || []))
    platformStats.appleMusic = appleMusicRes.data.platformStats?.appleMusic || { connected: false }
    if (appleMusicRes.data.artistData) {
      artistData = { ...artistData, ...appleMusicRes.data.artistData }
    }
  } else {
    errors.push(appleMusicRes.error || "Apple Music data fetch failed.")
    platformStats.appleMusic = { connected: false, error: appleMusicRes.error }
  }

  // Process Amazon Music data
  if (amazonMusicRes.success && amazonMusicRes.data) {
    allReleases.push(...(amazonMusicRes.data.releases || []))
    platformStats.amazonMusic = amazonMusicRes.data.platformStats?.amazonMusic || { connected: false }
    if (amazonMusicRes.data.artistData) {
      artistData = { ...artistData, ...amazonMusicRes.data.artistData }
    }
  } else {
    errors.push(amazonMusicRes.error || "Amazon Music data fetch failed.")
    platformStats.amazonMusic = { connected: false, error: amazonMusicRes.error }
  }

  // Sort releases by releaseDate in descending order
  allReleases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

  if (errors.length > 0 && allReleases.length === 0) {
    return NextResponse.json(
      {
        releases: [],
        platformStats: {},
        artistData: null,
        error: `Failed to fetch data from some sources: ${errors.join("; ")}`,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    releases: allReleases,
    platformStats,
    artistData,
    error: errors.length > 0 ? `Partial data loaded. Errors: ${errors.join("; ")}` : null,
  })
}
