import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

const VISITOR_COUNT_KEY = "visitor_count"
const VISITOR_SET_KEY = "visitor_set"

export async function GET() {
  try {
    const count = (await kv.get<number>(VISITOR_COUNT_KEY)) || 0

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    console.error("Error getting visitor count:", error)
    return NextResponse.json({ success: false, error: "Failed to get visitor count" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const visitorId = body.visitorId

    if (!visitorId) {
      return NextResponse.json({ success: false, error: "Visitor ID required" }, { status: 400 })
    }

    // Check if visitor has been counted before
    const isExistingVisitor = await kv.sismember(VISITOR_SET_KEY, visitorId)

    if (!isExistingVisitor) {
      // Add visitor to set
      await kv.sadd(VISITOR_SET_KEY, visitorId)

      // Increment counter
      const newCount = await kv.incr(VISITOR_COUNT_KEY)

      return NextResponse.json({
        success: true,
        count: newCount,
        isNew: true,
      })
    }

    // Return current count for existing visitor
    const count = (await kv.get<number>(VISITOR_COUNT_KEY)) || 0

    return NextResponse.json({
      success: true,
      count,
      isNew: false,
    })
  } catch (error) {
    console.error("Error updating visitor count:", error)
    return NextResponse.json({ success: false, error: "Failed to update visitor count" }, { status: 500 })
  }
}
