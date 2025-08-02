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

  const status = {
    spotify: {
      clientId: !!spotifyClientId,
      clientSecret: !!spotifyClientSecret,
      artistId: !!spotifyArtistId,
      configured: !!spotifyClientId && !!spotifyClientSecret && !!spotifyArtistId,
    },
    youtube: {
      apiKey: !!youtubeApiKey,
      channelId: !!youtubeChannelId,
      configured: !!youtubeApiKey && !!youtubeChannelId,
    },
    appleMusic: {
      privateKey: !!appleMusicPrivateKey,
      keyId: !!appleMusicKeyId,
      teamId: !!appleMusicTeamId,
      artistId: !!appleMusicArtistId,
      configured: !!appleMusicPrivateKey && !!appleMusicKeyId && !!appleMusicTeamId && !!appleMusicArtistId,
    },
    amazonMusic: {
      configured: true, // Amazon Music has no public API, so we assume it's "configured" for mock data
    },
  }

  return NextResponse.json(status)
}
