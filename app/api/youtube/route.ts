import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testMode = searchParams.get("test") === "true"

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({
      success: false,
      error: "YouTube API Key is not configured.",
      releases: [],
      channel: null,
    })
  }

  if (!YOUTUBE_CHANNEL_ID && !testMode) {
    return NextResponse.json({
      success: false,
      error: "YouTube Channel ID is not configured.",
      releases: [],
      channel: null,
    })
  }

  try {
    let channelData = null
    if (YOUTUBE_CHANNEL_ID) {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
      )
      if (channelRes.ok) {
        const data = await channelRes.json()
        if (data.items && data.items.length > 0) {
          const item = data.items[0]
          channelData = {
            name: item.snippet.title,
            subscribers: Number.parseInt(item.statistics.subscriberCount),
            videoCount: Number.parseInt(item.statistics.videoCount),
            totalViews: Number.parseInt(item.statistics.viewCount),
            image: item.snippet.thumbnails.high.url,
            youtubeUrl: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`,
          }
        }
      } else {
        const errorData = await channelRes.json()
        console.warn(
          `Could not fetch YouTube channel data for ID ${YOUTUBE_CHANNEL_ID}: ${errorData.error?.message || channelRes.statusText}`,
        )
      }
    }

    const releases = []
    if (YOUTUBE_CHANNEL_ID) {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=20&order=date&type=video&key=${YOUTUBE_API_KEY}`,
      )

      if (videosRes.ok) {
        const videosData = await videosRes.json()
        for (const item of videosData.items) {
          if (item.id.videoId) {
            // Fetch video statistics for views
            const statsRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${item.id.videoId}&key=${YOUTUBE_API_KEY}`,
            )
            let views = "N/A"
            if (statsRes.ok) {
              const statsData = await statsRes.json()
              if (statsData.items && statsData.items.length > 0) {
                views = Number.parseInt(statsData.items[0].statistics.viewCount).toLocaleString()
              }
            }

            releases.push({
              id: item.id.videoId,
              title: item.snippet.title,
              platform: "YouTube",
              releaseDate: item.snippet.publishedAt,
              image: item.snippet.thumbnails.high.url,
              link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              type: "Video",
              streams: views, // Using views for YouTube
            })
          }
        }
      } else {
        const errorData = await videosRes.json()
        console.warn(
          `Could not fetch YouTube videos for channel ID ${YOUTUBE_CHANNEL_ID}: ${errorData.error?.message || videosRes.statusText}`,
        )
      }
    }

    return NextResponse.json({
      success: true,
      releases,
      channel: channelData,
      totalReleases: releases.length,
    })
  } catch (error: any) {
    console.error("YouTube API Error:", error.message)
    return NextResponse.json({ success: false, error: error.message, releases: [], channel: null }, { status: 500 })
  }
}
