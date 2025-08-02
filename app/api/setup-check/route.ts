import { NextResponse } from "next/server"

export async function GET() {
  const spotifyClientIdConfigured = !!process.env.SPOTIFY_CLIENT_ID
  const spotifyClientSecretConfigured = !!process.env.SPOTIFY_CLIENT_SECRET
  const spotifyArtistIdConfigured = !!process.env.SPOTIFY_ARTIST_ID
  const youtubeApiKeyConfigured = !!process.env.YOUTUBE_API_KEY
  const youtubeChannelIdConfigured = !!process.env.YOUTUBE_CHANNEL_ID

  const allConfigured =
    spotifyClientIdConfigured &&
    spotifyClientSecretConfigured &&
    spotifyArtistIdConfigured &&
    youtubeApiKeyConfigured &&
    youtubeChannelIdConfigured

  return NextResponse.json({
    spotify: {
      clientId: spotifyClientIdConfigured,
      clientSecret: spotifyClientSecretConfigured,
      artistId: spotifyArtistIdConfigured,
    },
    youtube: {
      apiKey: youtubeApiKeyConfigured,
      channelId: youtubeChannelIdConfigured,
    },
    allConfigured,
  })
}
