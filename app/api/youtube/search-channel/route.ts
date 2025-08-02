import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API Key is not configured." }, { status: 500 })
  }

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query,
      )}&type=channel&maxResults=10&key=${YOUTUBE_API_KEY}`,
    )

    if (!searchRes.ok) {
      const errorData = await searchRes.json()
      console.error("YouTube search error:", errorData)
      return NextResponse.json({ error: errorData.error?.message || "Failed to search YouTube" }, { status: 500 })
    }

    const data = await searchRes.json()
    const channels = data.items.map((item: any) => ({
      id: item.snippet.channelId,
      name: item.snippet.channelTitle,
      description: item.snippet.description,
      image: item.snippet.thumbnails.high.url,
    }))

    return NextResponse.json({ channels })
  } catch (error: any) {
    console.error("YouTube Search API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
