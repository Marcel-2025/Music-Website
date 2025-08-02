import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ success: false, message: "Query parameter is required." }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ success: false, message: "YouTube API key is not configured." }, { status: 400 })
  }

  try {
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(
        query,
      )}&type=channel&part=snippet&maxResults=10`,
    )

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      throw new Error(`YouTube search API error: ${searchResponse.status} - ${errorText}`)
    }

    const searchData = await searchResponse.json()
    const channels = searchData.items.map((item: any) => ({
      id: item.id.channelId,
      name: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
    }))

    return NextResponse.json({ success: true, channels })
  } catch (error: any) {
    console.error("YouTube search channel error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to search YouTube channels." },
      { status: 500 },
    )
  }
}
