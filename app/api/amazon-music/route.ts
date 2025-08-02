import { NextResponse } from "next/server"

export async function GET() {
  // Amazon Music does not have a public API for fetching artist releases or stats.
  // This route is a placeholder and will always return an empty array and disconnected status.
  return NextResponse.json({
    success: true,
    releases: [],
    artist: null,
    error: "Amazon Music API not available",
  })
}
