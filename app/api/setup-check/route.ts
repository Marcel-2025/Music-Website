import { NextResponse } from "next/server"

export async function GET() {
  const credentials = {
    spotify: {
      clientId: !!process.env.SPOTIFY_CLIENT_ID,
      clientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      artistId: !!process.env.SPOTIFY_ARTIST_ID,
      clientIdValue: process.env.SPOTIFY_CLIENT_ID ? `${process.env.SPOTIFY_CLIENT_ID.substring(0, 8)}...` : "Not set",
    },
    youtube: {
      apiKey: !!process.env.YOUTUBE_API_KEY,
      channelId: !!process.env.YOUTUBE_CHANNEL_ID,
    },
    appleMusic: {
      privateKey: !!process.env.APPLE_MUSIC_PRIVATE_KEY,
      keyId: !!process.env.APPLE_MUSIC_KEY_ID,
      teamId: !!process.env.APPLE_MUSIC_TEAM_ID,
      artistId: !!process.env.APPLE_MUSIC_ARTIST_ID,
    },
  }

  const allConfigured = {
    spotify: credentials.spotify.clientId && credentials.spotify.clientSecret && credentials.spotify.artistId,
    youtube: credentials.youtube.apiKey && credentials.youtube.channelId,
    appleMusic:
      credentials.appleMusic.privateKey &&
      credentials.appleMusic.keyId &&
      credentials.appleMusic.teamId &&
      credentials.appleMusic.artistId,
  }

  return NextResponse.json({
    credentials,
    allConfigured,
    nextSteps: {
      spotify: !allConfigured.spotify ? "Need Client Secret and Artist ID" : "✅ Ready",
      youtube: !allConfigured.youtube ? "Need API Key and Channel ID" : "✅ Ready",
      appleMusic: !allConfigured.appleMusic ? "Need Apple Developer Account setup" : "✅ Ready",
    },
  })
}
