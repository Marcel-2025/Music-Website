import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory storage (will reset on server restart)
// For production, use Vercel KV, Postgres, or another persistent storage
let visitorCount = 0
const visitors = new Set<string>()

export async function GET() {
  try {
    const cookieStore = await cookies()
    const visitorId = cookieStore.get("visitor_id")?.value

    let isNewVisitor = false

    // Check if this is a new visitor
    if (!visitorId) {
      // Generate a unique visitor ID
      const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`

      // Increment count for new visitor
      if (!visitors.has(newVisitorId)) {
        visitors.add(newVisitorId)
        visitorCount++
        isNewVisitor = true
      }

      // Set cookie (expires in 30 days)
      const response = NextResponse.json({
        success: true,
        count: visitorCount,
        isNewVisitor,
      })

      response.cookies.set("visitor_id", newVisitorId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      })

      return response
    } else {
      // Existing visitor
      if (!visitors.has(visitorId)) {
        visitors.add(visitorId)
      }

      return NextResponse.json({
        success: true,
        count: visitorCount,
        isNewVisitor: false,
      })
    }
  } catch (error) {
    console.error("Visitor count error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track visitor",
        count: 0,
        isNewVisitor: false,
      },
      { status: 500 },
    )
  }
}
