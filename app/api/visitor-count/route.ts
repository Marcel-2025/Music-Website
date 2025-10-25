import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory counter (resets on deployment)
// For production, use Vercel KV or a database
let visitorCount = 0
const visitedIPs = new Set<string>()

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const hasVisited = cookieStore.get("visited")

  // Get IP address for additional uniqueness check
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"

  let isNewVisitor = false

  // If no cookie and IP hasn't been seen, increment counter
  if (!hasVisited && !visitedIPs.has(ip)) {
    visitorCount++
    visitedIPs.add(ip)
    isNewVisitor = true
  }

  const response = NextResponse.json({
    count: visitorCount,
    isNewVisitor,
  })

  // Set cookie if not already set
  if (!hasVisited) {
    response.cookies.set("visited", "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: "strict",
    })
  }

  return response
}
