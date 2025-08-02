import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

async function getChannelInfo(apiKey: string, channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
  )
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get YouTube channel info: ${response.status} - ${errorText}`)
  }
  return response.json()
}

async function getChannelVideos(apiKey: string, channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20&type=video`,
  )
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get YouTube channel videos: ${response.status} - ${errorText}`)
  }
  return response.json()
}

export async function GET() {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json(
      {
        success: false,
        message: "YouTube API key or Channel ID are not configured.",
        platformStats: { youtube: { connected: false, error: "Missing API key or Channel ID" } },
      },
      { status: 400 },
    )
  }

  try {
    const [channelData, videosData] = await Promise.all([
      getChannelInfo(YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID),
      getChannelVideos(YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID),
    ])

    const channel = channelData.items[0]
    if (!channel) {
      throw new Error("YouTube channel not found or no data returned.")
    }

    const releases = videosData.items.map((video: any) => ({
      id: video.id.videoId,
      title: video.snippet.title,
      platform: "YouTube",
      releaseDate: video.snippet.publishedAt,
      streams: "N/A", // YouTube search API doesn't provide view counts directly
      image: video.snippet.thumbnails.high.url || "/placeholder.png?height=300&width=300&query=youtube video thumbnail",
      link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      type: "Video",
      artists: video.snippet.channelTitle,
    }))

    return NextResponse.json({
      success: true,
      releases,
      platformStats: {
        youtube: {
          subscribers: Number.parseInt(channel.statistics.subscriberCount || "0"),
          videoCount: Number.parseInt(channel.statistics.videoCount || "0"),
          name: channel.snippet.title,
          connected: true,
        },
      },
      artistData: {
        name: channel.snippet.title,
        followers: Number.parseInt(channel.statistics.subscriberCount || "0"),
        image: channel.snippet.thumbnails.high.url || "/placeholder-user.png",
        genres: [], // YouTube API doesn't provide genres for channels
        popularity: 0,
      },
    })
  } catch (error: any) {
    console.error("YouTube API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch YouTube data.",
        platformStats: { youtube: { connected: false, error: error.message || "API Error" } },
      },
      { status: 500 },
    )
  }
}
