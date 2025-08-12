import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API key not set" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}&part=snippet,id&type=channel&maxResults=5`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("YouTube search API request failed:", response.status, errorText)
      throw new Error(`YouTube search API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const channels = data.items.map((item: any) => ({
      id: item.id.channelId,
      name: item.snippet.channelTitle,
      imageUrl: item.snippet.thumbnails.high.url || "/placeholder.svg",
    }))

    return NextResponse.json({ channels })
  } catch (error) {
    console.error("Error searching YouTube channels:", error)
    return NextResponse.json({ error: "Failed to search YouTube channels" }, { status: 500 })
  }
}
