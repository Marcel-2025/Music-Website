import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}

interface YouTubeVideoDetails {
  id: string
  contentDetails: {
    duration: string
  }
}

function parseDuration(duration: string): number {
  // Parse ISO 8601 duration format (PT4M13S) to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  return hours * 3600 + minutes * 60 + seconds
}

export async function GET(request: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      return NextResponse.json({ error: "YouTube API credentials not configured" }, { status: 500 })
    }

    // First, get the videos from the channel (fetch more to account for filtering)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&order=date&maxResults=50&type=video`

    const searchResponse = await fetch(searchUrl)
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    const videos: YouTubeVideo[] = searchData.items || []

    if (videos.length === 0) {
      return NextResponse.json({ videos: [] })
    }

    // Get video IDs for details API call
    const videoIds = videos.map((video) => video.id.videoId).join(",")

    // Get video details including duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails`

    const detailsResponse = await fetch(detailsUrl)
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`)
    }

    const detailsData = await detailsResponse.json()
    const videoDetails: YouTubeVideoDetails[] = detailsData.items || []

    // Create a map of video ID to duration
    const durationMap = new Map<string, number>()
    videoDetails.forEach((detail) => {
      const durationInSeconds = parseDuration(detail.contentDetails.duration)
      durationMap.set(detail.id, durationInSeconds)
    })

    // Filter out YouTube Shorts (videos under 60 seconds) and format the response
    const filteredVideos = videos
      .filter((video) => {
        const duration = durationMap.get(video.id.videoId) || 0
        return duration >= 60 // Exclude videos under 60 seconds (Shorts)
      })
      .slice(0, 20) // Limit to 20 videos after filtering
      .map((video) => ({
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        duration: durationMap.get(video.id.videoId) || 0,
      }))

    return NextResponse.json({ videos: filteredVideos })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
  }
}
