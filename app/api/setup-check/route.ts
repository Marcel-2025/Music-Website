import { NextResponse } from "next/server"

export async function GET() {
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const spotifyArtistId = process.env.SPOTIFY_ARTIST_ID

  const youtubeApiKey = process.env.YOUTUBE_API_KEY
  const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID

  const appleMusicPrivateKey = process.env.APPLE_MUSIC_PRIVATE_KEY
  const appleMusicKeyId = process.env.APPLE_MUSIC_KEY_ID
  const appleMusicTeamId = process.env.APPLE_MUSIC_TEAM_ID
  const appleMusicArtistId = process.env.APPLE_MUSIC_ARTIST_ID

  const spotifyConfigured = !!spotifyClientId && !!spotifyClientSecret && !!spotifyArtistId
  const youtubeConfigured = !!youtubeApiKey && !!youtubeChannelId
  const appleMusicConfigured = !!appleMusicPrivateKey && !!appleMusicKeyId && !!appleMusicTeamId && !!appleMusicArtistId

  return NextResponse.json({
    allConfigured: {
      spotify: spotifyConfigured,
      youtube: youtubeConfigured,
      appleMusic: appleMusicConfigured,
    },
    credentials: {
      spotify: {
        clientId: !!spotifyClientId,
        clientIdValue: spotifyClientId || "Not Configured",
        clientSecret: !!spotifyClientSecret,
        artistId: !!spotifyArtistId,
        artistIdValue: spotifyArtistId || "Not Configured",
      },
      youtube: {
        apiKey: !!youtubeApiKey,
        channelId: !!youtubeChannelId,
        channelIdValue: youtubeChannelId || "Not Configured",
      },
      appleMusic: {
        privateKey: !!appleMusicPrivateKey,
        keyId: !!appleMusicKeyId,
        teamId: !!appleMusicTeamId,
        artistId: !!appleMusicArtistId,
        artistIdValue: appleMusicArtistId || "Not Configured",
      },
    },
    nextSteps: {
      spotify: spotifyConfigured ? "OK" : "Missing Credentials/Artist ID",
      youtube: youtubeConfigured ? "OK" : "Missing API Key/Channel ID",
      appleMusic: appleMusicConfigured ? "OK" : "Missing Credentials/Artist ID",
    },
  })
}
