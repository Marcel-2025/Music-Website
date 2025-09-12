import { type NextRequest, NextResponse } from "next/server"

interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
    }
    publishedAt: string
  }
}

interface YouTubeVideoDetails {
  id: string
  contentDetails: {
    duration: string
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  return hours * 3600 + minutes * 60 + seconds
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get("channelId") || process.env.YOUTUBE_CHANNEL_ID

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    // Fetch more videos initially to account for filtering out Shorts
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`,
    )

    if (!searchResponse.ok) {
      throw new Error("Failed to fetch YouTube videos")
    }

    const searchData = await searchResponse.json()
    const videos: YouTubeVideo[] = searchData.items || []

    if (videos.length === 0) {
      return NextResponse.json({ videos: [] })
    }

    // Get video IDs for details API call
    const videoIds = videos.map((video: YouTubeVideo) => video.id.videoId).join(",")

    // Fetch video details to get duration
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails`,
    )

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const detailsData = await detailsResponse.json()
    const videoDetails: YouTubeVideoDetails[] = detailsData.items || []

    // Create a map of video ID to duration
    const durationMap = new Map()
    videoDetails.forEach((detail: YouTubeVideoDetails) => {
      const durationInSeconds = parseDuration(detail.contentDetails.duration)
      durationMap.set(detail.id, durationInSeconds)
    })

    // Filter out YouTube Shorts (videos under 60 seconds)
    const filteredVideos = videos
      .filter((video: YouTubeVideo) => {
        const duration = durationMap.get(video.id.videoId)
        return duration && duration >= 60 // Only include videos 60 seconds or longer
      })
      .slice(0, 20) // Limit to 20 videos after filtering
      .map((video: YouTubeVideo) => ({
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        publishedAt: video.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        duration: durationMap.get(video.id.videoId),
      }))

    return NextResponse.json({ videos: filteredVideos })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
  }
}
