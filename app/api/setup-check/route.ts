import { NextResponse } from "next/server"

export async function GET() {
  const spotifyConnected =
    !!process.env.SPOTIFY_CLIENT_ID && !!process.env.SPOTIFY_CLIENT_SECRET && !!process.env.SPOTIFY_ARTIST_ID

  const youtubeConnected = !!process.env.YOUTUBE_API_KEY && !!process.env.YOUTUBE_CHANNEL_ID

  return NextResponse.json({
    spotify: spotifyConnected,
    youtube: youtubeConnected,
  })
}
