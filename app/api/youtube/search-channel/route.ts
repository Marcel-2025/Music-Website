import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
  }

  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ success: false, error: "YouTube API key is not configured." }, { status: 400 })
    }

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=10&key=${YOUTUBE_API_KEY}`,
    )

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      console.error("YouTube search API error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to search YouTube channels: ${errorData.error?.message || searchResponse.statusText}`,
        },
        { status: searchResponse.status },
      )
    }

    const data = await searchResponse.json()
    const channels = data.items.map((item: any) => ({
      id: item.id.channelId,
      name: item.snippet.channelTitle,
      description: item.snippet.description,
      image: item.snippet.thumbnails.high?.url || null,
      youtubeUrl: `https://www.youtube.com/channel/${item.id.channelId}`,
    }))

    return NextResponse.json({ success: true, channels })
  } catch (error: any) {
    console.error("YouTube search API route error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
