"use client"

import { useState, useEffect } from "react"

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0)
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function trackVisitor() {
      try {
        // Get or create visitor ID from localStorage
        let visitorId = localStorage.getItem("visitorId")
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("visitorId", visitorId)
        }

        // Send visitor ID to server
        const response = await fetch("/api/visitor-count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        })

        if (!response.ok) {
          throw new Error("Failed to track visitor")
        }

        const data = await response.json()
        if (data.success) {
          setCount(data.count)
          setIsNewVisitor(data.isNew)
        }
      } catch (error) {
        console.error("Failed to track visitor:", error)
        // Fallback: try to get count without tracking
        try {
          const response = await fetch("/api/visitor-count")
          const data = await response.json()
          if (data.success) {
            setCount(data.count)
          }
        } catch (e) {
          console.error("Failed to get visitor count:", e)
        }
      } finally {
        setLoading(false)
      }
    }

    trackVisitor()
  }, [])

  return { count, isNewVisitor, loading }
}
