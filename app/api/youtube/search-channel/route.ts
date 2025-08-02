import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ success: false, error: "YouTube API Key not configured" }, { status: 400 })
  }

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query,
      )}&type=channel&maxResults=5&key=${YOUTUBE_API_KEY}`,
    )
    const data = await response.json()

    if (!response.ok || data.error) {
      console.error("YouTube Search API Error:", data.error)
      return NextResponse.json(
        { success: false, error: data.error?.message || "Failed to search YouTube channels" },
        { status: response.status },
      )
    }

    const channels = data.items.map((item: any) => ({
      id: item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
    }))

    return NextResponse.json({ success: true, channels })
  } catch (error) {
    console.error("YouTube Search API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to search YouTube channels" }, { status: 500 })
  }
}
