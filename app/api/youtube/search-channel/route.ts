import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API Key not configured." }, { status: 500 })
  }

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query,
      )}&type=channel&key=${process.env.YOUTUBE_API_KEY}`,
    )
    const data = await response.json()

    if (!response.ok || data.error) {
      console.error("YouTube Search API Error:", data.error)
      return NextResponse.json(
        { error: "Failed to search channels", details: data.error?.message || "Unknown error" },
        { status: response.status },
      )
    }

    const channels = data.items.map((item: any) => ({
      id: item.snippet.channelId,
      name: item.snippet.channelTitle,
      description: item.snippet.description,
      image: item.snippet.thumbnails.high.url,
      youtubeUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
    }))

    return NextResponse.json({ channels })
  } catch (error: any) {
    console.error("YouTube search API call failed:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
