import { NextResponse } from "next/server"

const API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "YouTube API key is not set." }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=5&key=${API_KEY}`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to search YouTube channels: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const channels = data.items.map((channel: any) => ({
      id: channel.id.channelId,
      name: channel.snippet.channelTitle,
      image: channel.snippet.thumbnails.high.url || null,
    }))

    return NextResponse.json({ channels })
  } catch (error: any) {
    console.error("YouTube search channel API error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
