import { NextResponse } from "next/server"

// Amazon Music does not provide a public API for fetching artist releases.
// This route handler is a placeholder and will always return a "not available" message.
export async function GET() {
  return NextResponse.json({
    success: false,
    error: "Amazon Music API is not publicly available for fetching releases.",
    releases: [],
  })
}
