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

  const configStatus = {
    spotify: {
      clientIdConfigured: !!spotifyClientId,
      clientSecretConfigured: !!spotifyClientSecret,
      artistIdConfigured: !!spotifyArtistId,
      allConfigured: !!spotifyClientId && !!spotifyClientSecret && !!spotifyArtistId,
      artistId: spotifyArtistId || null, // Expose non-sensitive ID for client-side display/search
    },
    youtube: {
      apiKeyConfigured: !!youtubeApiKey,
      channelIdConfigured: !!youtubeChannelId,
      allConfigured: !!youtubeApiKey && !!youtubeChannelId,
      channelId: youtubeChannelId || null, // Expose non-sensitive ID for client-side display/search
    },
    appleMusic: {
      privateKeyConfigured: !!appleMusicPrivateKey,
      keyIdConfigured: !!appleMusicKeyId,
      teamIdConfigured: !!appleMusicTeamId,
      artistIdConfigured: !!appleMusicArtistId,
      allConfigured: !!appleMusicPrivateKey && !!appleMusicKeyId && !!appleMusicTeamId && !!appleMusicArtistId,
      artistId: appleMusicArtistId || null, // Expose non-sensitive ID
    },
  }

  return NextResponse.json(configStatus)
}
