import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get("channelId")
  const testMode = searchParams.get("test") === "true"

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API Key not configured." }, { status: 500 })
  }

  if (!channelId) {
    return NextResponse.json({ error: "Channel ID is required." }, { status: 400 })
  }

  try {
    // Fetch channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`,
    )
    const channelData = await channelResponse.json()

    if (!channelResponse.ok || channelData.error) {
      console.error("YouTube Channel API Error:", channelData.error)
      return NextResponse.json(
        { error: "Failed to fetch channel data", details: channelData.error?.message || "Unknown error" },
        { status: channelResponse.status },
      )
    }

    const channel = channelData.items[0]
    if (!channel) {
      return NextResponse.json({ success: false, message: "Channel not found." }, { status: 404 })
    }

    const channelInfo = {
      id: channel.id,
      name: channel.snippet.title,
      description: channel.snippet.description,
      image: channel.snippet.thumbnails.high.url,
      subscribers: Number.parseInt(channel.statistics.subscriberCount, 10),
      videoCount: Number.parseInt(channel.statistics.videoCount, 10),
      viewCount: Number.parseInt(channel.statistics.viewCount, 10),
      youtubeUrl: `https://www.youtube.com/channel/${channel.id}`,
    }

    if (testMode) {
      return NextResponse.json({ success: true, channel: channelInfo })
    }

    // Fetch latest videos (releases)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`,
    )
    const videosData = await videosResponse.json()

    if (!videosResponse.ok || videosData.error) {
      console.error("YouTube Videos API Error:", videosData.error)
      return NextResponse.json(
        { error: "Failed to fetch videos", details: videosData.error?.message || "Unknown error" },
        { status: videosResponse.status },
      )
    }

    const releases = videosData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      platform: "youtube",
    }))

    return NextResponse.json({
      channel: channelInfo,
      releases,
      totalReleases: releases.length,
    })
  } catch (error: any) {
    console.error("YouTube API call failed:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
