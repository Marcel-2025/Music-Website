import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function GET() {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({ error: "YouTube API key or channel ID not set" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("YouTube API request failed:", response.status, errorText)
      throw new Error(`YouTube API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const releases = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      imageUrl: item.snippet.thumbnails.high.url || "/placeholder.svg",
      platform: "youtube",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))

    return NextResponse.json({ releases })
  } catch (error) {
    console.error("Error fetching YouTube releases:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube releases" }, { status: 500 })
  }
}
