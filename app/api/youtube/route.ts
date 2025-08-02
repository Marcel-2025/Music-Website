import { NextResponse } from "next/server"

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

async function getChannelData() {
  if (!API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API key or Channel ID is not set.")
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`,
  )
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get YouTube channel data: ${response.status} - ${errorText}`)
  }
  return response.json()
}

async function getChannelVideos() {
  if (!API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API key or Channel ID is not set.")
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`,
  )
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get YouTube channel videos: ${response.status} - ${errorText}`)
  }
  return response.json()
}

export async function GET() {
  try {
    const [channelData, videosData] = await Promise.all([getChannelData(), getChannelVideos()])

    const channel = channelData.items[0]
    if (!channel) {
      throw new Error("YouTube channel not found.")
    }

    const releases = videosData.items.map((video: any) => ({
      id: video.id.videoId,
      title: video.snippet.title,
      platform: "YouTube",
      releaseDate: video.snippet.publishedAt,
      streams: "N/A", // YouTube search API doesn't directly provide view counts here
      image: video.snippet.thumbnails.high.url || "/placeholder.png",
      link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      type: "Video",
      artists: video.snippet.channelTitle,
    }))

    const platformStats = {
      youtube: {
        subscribers: Number.parseInt(channel.statistics.subscriberCount),
        videoCount: Number.parseInt(channel.statistics.videoCount),
        name: channel.snippet.title,
        connected: true,
      },
    }

    const artistInfo = {
      name: channel.snippet.title,
      followers: Number.parseInt(channel.statistics.subscriberCount),
      image: channel.snippet.thumbnails.high.url || "/placeholder-user.jpg",
      genres: [], // YouTube API does not provide genres for channels
      popularity: 0, // YouTube API does not provide a popularity score
    }

    return NextResponse.json({ releases, platformStats, artistData: artistInfo })
  } catch (error: any) {
    console.error("YouTube API error:", error.message)
    return NextResponse.json(
      {
        releases: [],
        platformStats: { youtube: { connected: false, error: error.message } },
        artistData: null,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
