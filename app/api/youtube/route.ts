import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      return NextResponse.json(
        { success: false, error: "YouTube API key or Channel ID is not configured." },
        { status: 400 },
      )
    }

    // Fetch channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
    )

    if (!channelResponse.ok) {
      const errorData = await channelResponse.json()
      console.error("YouTube channel API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch YouTube channel data: ${errorData.error?.message || channelResponse.statusText}`,
        },
        { status: channelResponse.status },
      )
    }
    const channelData = await channelResponse.json()
    const channel = channelData.items[0]

    if (!channel) {
      return NextResponse.json(
        { success: false, error: "YouTube channel not found with the provided ID." },
        { status: 404 },
      )
    }

    // Fetch channel's videos (releases)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&type=video&order=date&maxResults=20&key=${YOUTUBE_API_KEY}`,
    )

    if (!videosResponse.ok) {
      const errorData = await videosResponse.json()
      console.error("YouTube videos API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch YouTube videos: ${errorData.error?.message || videosResponse.statusText}`,
        },
        { status: videosResponse.status },
      )
    }
    const videosData = await videosResponse.json()

    const releases = videosData.items.map((video: any) => ({
      id: video.id.videoId,
      title: video.snippet.title,
      platform: "YouTube",
      releaseDate: video.snippet.publishedAt,
      streams: "N/A", // YouTube search API doesn't provide view counts directly, would need separate video details call
      image: video.snippet.thumbnails.high?.url || "/placeholder.svg",
      link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      type: "Video",
      artists: video.snippet.channelTitle,
    }))

    return NextResponse.json({
      success: true,
      channel: {
        id: channel.id,
        name: channel.snippet.title,
        subscribers: Number.parseInt(channel.statistics.subscriberCount),
        videoCount: Number.parseInt(channel.statistics.videoCount),
        viewCount: Number.parseInt(channel.statistics.viewCount),
        image: channel.snippet.thumbnails.high?.url || "/placeholder.svg",
        youtubeUrl: `https://www.youtube.com/channel/${channel.id}`,
      },
      releases: releases,
      totalReleases: releases.length,
    })
  } catch (error: any) {
    console.error("YouTube API route error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
