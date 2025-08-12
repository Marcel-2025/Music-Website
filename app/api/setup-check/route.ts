import { NextResponse } from "next/server"

export async function GET() {
  const setupStatus = {
    spotify: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_ARTIST_ID),
    youtube: !!(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID),
    amazonMusic: false, // Not implemented yet
    appleMusic: false, // Not implemented yet
  }

  return NextResponse.json(setupStatus)
}
