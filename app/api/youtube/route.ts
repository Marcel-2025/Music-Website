import { NextResponse } from "next/server"

export async function GET() {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({ success: false, error: "YouTube API Key or Channel ID not configured" }, { status: 400 })
  }

  try {
    // Fetch channel details to get subscriber count and video count
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
    )
    const channelData = await channelResponse.json()

    if (!channelResponse.ok || channelData.error) {
      console.error("YouTube Channel API Error:", channelData.error)
      return NextResponse.json(
        { success: false, error: channelData.error?.message || "Failed to fetch YouTube channel data" },
        { status: channelResponse.status },
      )
    }

    const channel = channelData.items[0]
    const channelInfo = {
      id: channel.id,
      name: channel.snippet.title,
      description: channel.snippet.description,
      image: channel.snippet.thumbnails.high.url,
      subscribers: Number.parseInt(channel.statistics.subscriberCount, 10),
      videoCount: Number.parseInt(channel.statistics.videoCount, 10),
      totalViews: Number.parseInt(channel.statistics.viewCount, 10), // Added totalViews
      youtubeUrl: `https://www.youtube.com/channel/${channel.id}`,
    }

    // Fetch latest videos from the channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`,
    )
    const videosData = await videosResponse.json()

    if (!videosResponse.ok || videosData.error) {
      console.error("YouTube Videos API Error:", videosData.error)
      return NextResponse.json(
        { success: false, error: videosData.error?.message || "Failed to fetch YouTube videos" },
        { status: videosResponse.status },
      )
    }

    const releases = videosData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      platform: "YouTube",
      releaseDate: item.snippet.publishedAt,
      image: item.snippet.thumbnails.high.url,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: "Video",
      views: "N/A", // YouTube API search results don't directly provide view counts
    }))

    return NextResponse.json({ success: true, releases, channel: channelInfo })
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch YouTube data" }, { status: 500 })
  }
}
