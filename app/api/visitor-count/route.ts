import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory counter (resets on deployment)
// For production, use Vercel KV or a database
let visitorCount = 0
const visitors = new Set<string>()

export async function GET() {
  try {
    const cookieStore = await cookies()
    const visitorId = cookieStore.get("visitor_id")?.value

    if (!visitorId) {
      // New visitor
      const newVisitorId = `visitor_${Date.now()}_${Math.random()}`
      visitors.add(newVisitorId)
      visitorCount++

      const response = NextResponse.json({
        success: true,
        count: visitorCount,
        isNewVisitor: true,
      })

      response.cookies.set("visitor_id", newVisitorId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })

      return response
    }

    // Returning visitor
    return NextResponse.json({
      success: true,
      count: visitorCount,
      isNewVisitor: false,
    })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track visitor",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Initialize counter (for testing purposes)
    visitorCount = 0
    visitors.clear()

    return NextResponse.json({
      success: true,
      count: visitorCount,
      message: "Counter reset successfully",
    })
  } catch (error) {
    console.error("Error resetting counter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset counter",
      },
      { status: 500 },
    )
  }
}
