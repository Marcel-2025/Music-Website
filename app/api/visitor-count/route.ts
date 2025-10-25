import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (will reset on deployment)
let visitorCount = 0
const visitors = new Set<string>()

export async function GET(request: NextRequest) {
  try {
    const visitorId = request.cookies.get("visitor_id")?.value

    return NextResponse.json({
      count: visitorCount,
      isNewVisitor: !visitorId || !visitors.has(visitorId),
    })
  } catch (error) {
    console.error("Error fetching visitor count:", error)
    return NextResponse.json({ count: 0, isNewVisitor: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let visitorId = request.cookies.get("visitor_id")?.value

    // Generate new visitor ID if doesn't exist
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`
    }

    // Only count if this visitor hasn't been counted before
    if (!visitors.has(visitorId)) {
      visitors.add(visitorId)
      visitorCount++

      const response = NextResponse.json({
        count: visitorCount,
        isNewVisitor: true,
      })

      // Set cookie that expires in 30 days
      response.cookies.set("visitor_id", visitorId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "lax",
      })

      return response
    }

    return NextResponse.json({
      count: visitorCount,
      isNewVisitor: false,
    })
  } catch (error) {
    console.error("Error updating visitor count:", error)
    return NextResponse.json({ count: visitorCount, isNewVisitor: false }, { status: 500 })
  }
}
