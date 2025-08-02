import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || "Ehhm.s"

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 400 })
    }

    // Search for channels
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=10&key=${YOUTUBE_API_KEY}`,
    )

    if (!searchResponse.ok) {
      const error = await searchResponse.text()
      throw new Error(`YouTube search failed: ${error}`)
    }

    const searchData = await searchResponse.json()

    // Get detailed channel info for each result
    const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(",")

    if (channelIds) {
      const channelsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`,
      )

      const channelsData = await channelsResponse.json()

      const channels = channelsData.items.map((channel: any) => ({
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
        subscriberCount: Number.parseInt(channel.statistics.subscriberCount || "0"),
        videoCount: Number.parseInt(channel.statistics.videoCount || "0"),
        viewCount: Number.parseInt(channel.statistics.viewCount || "0"),
        customUrl: channel.snippet.customUrl,
        publishedAt: channel.snippet.publishedAt,
        youtubeUrl: `https://www.youtube.com/channel/${channel.id}`,
      }))

      return NextResponse.json({
        query,
        channels,
        message: channels.length > 0 ? "Found channels matching your search" : "No channels found",
      })
    }

    return NextResponse.json({
      query,
      channels: [],
      message: "No channels found",
    })
  } catch (error) {
    console.error("YouTube Search Error:", error)
    return NextResponse.json(
      {
        error: "Failed to search YouTube channels",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
