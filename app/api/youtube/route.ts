import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testChannelId = searchParams.get("channelId")
    const channelId = testChannelId || YOUTUBE_CHANNEL_ID

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 400 })
    }

    if (!channelId) {
      return NextResponse.json(
        {
          error: "YouTube Channel ID not configured",
          message: "Please add your YOUTUBE_CHANNEL_ID to environment variables",
        },
        { status: 400 },
      )
    }

    // Get channel info
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`,
    )

    if (!channelResponse.ok) {
      const error = await channelResponse.text()
      throw new Error(`Failed to fetch channel info: ${error}`)
    }

    const channelData = await channelResponse.json()

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: "Channel not found with the provided ID" }, { status: 404 })
    }

    // Get recent videos from the channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${YOUTUBE_API_KEY}`,
    )

    if (!videosResponse.ok) {
      const error = await videosResponse.text()
      throw new Error(`Failed to fetch videos: ${error}`)
    }

    const videosData = await videosResponse.json()

    // Get video statistics for each video
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(",")
    let videosWithStats = []

    if (videoIds) {
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      )

      const statsData = await statsResponse.json()

      // Combine video data with statistics
      videosWithStats = videosData.items.map((video: any, index: number) => {
        const stats = statsData.items.find((stat: any) => stat.id === video.id.videoId)
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          platform: "YouTube",
          platformIcon: "YouTube",
          releaseDate: video.snippet.publishedAt.split("T")[0],
          streams: `${Number.parseInt(stats?.statistics.viewCount || "0").toLocaleString()} views`,
          image: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
          link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          type: "Video",
          views: Number.parseInt(stats?.statistics.viewCount || "0"),
          likes: Number.parseInt(stats?.statistics.likeCount || "0"),
          duration: stats?.contentDetails.duration,
          description: video.snippet.description,
        }
      })
    }

    const channel = channelData.items[0]
    return NextResponse.json({
      success: true,
      releases: videosWithStats,
      channel: {
        id: channel.id,
        name: channel.snippet.title,
        description: channel.snippet.description,
        subscribers: Number.parseInt(channel.statistics.subscriberCount || "0"),
        totalViews: Number.parseInt(channel.statistics.viewCount || "0"),
        videoCount: Number.parseInt(channel.statistics.videoCount || "0"),
        image: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
        customUrl: channel.snippet.customUrl,
        youtubeUrl: `https://www.youtube.com/channel/${channel.id}`,
      },
      totalReleases: videosWithStats.length,
    })
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch YouTube data",
        details: error instanceof Error ? error.message : "Unknown error",
        configured: {
          apiKey: !!YOUTUBE_API_KEY,
          channelId: !!YOUTUBE_CHANNEL_ID,
        },
      },
      { status: 500 },
    )
  }
}
