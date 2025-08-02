import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ success: false, error: "Query parameter is required." }, { status: 400 })
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ success: false, error: "YouTube API key is not configured." }, { status: 400 })
    }

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=10&key=${YOUTUBE_API_KEY}`,
    )

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      console.error("YouTube channel search API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to search YouTube channels: ${errorData.error?.message || searchResponse.statusText}`,
        },
        { status: searchResponse.status },
      )
    }

    const searchData = await searchResponse.json()
    const channels = searchData.items.map((channel: any) => ({
      id: channel.id.channelId,
      name: channel.snippet.channelTitle,
      image: channel.snippet.thumbnails.high?.url || "/placeholder.png",
      youtubeUrl: `https://www.youtube.com/channel/${channel.id.channelId}`,
    }))

    return NextResponse.json({ success: true, channels })
  } catch (error: any) {
    console.error("YouTube search channel API route error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
