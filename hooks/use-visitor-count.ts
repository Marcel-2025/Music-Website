"use client"

import { useEffect, useState } from "react"

interface VisitorCountData {
  count: number
  isNewVisitor: boolean
  loading: boolean
  error: string | null
}

export function useVisitorCount(): VisitorCountData {
  const [count, setCount] = useState(0)
  const [isNewVisitor, setIsNewVisitor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/visitor-count", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch visitor count")
        }

        const data = await response.json()

        if (data.success) {
          setCount(data.count)
          setIsNewVisitor(data.isNewVisitor)
        } else {
          setError(data.error || "Unknown error")
        }
      } catch (err) {
        console.error("Error fetching visitor count:", err)
        setError(err instanceof Error ? err.message : "Failed to load visitor count")
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorCount()
  }, [])

  return { count, isNewVisitor, loading, error }
}
