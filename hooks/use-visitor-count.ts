"use client"

import { useState, useEffect } from "react"

interface VisitorCountData {
  count: number
  isNewVisitor: boolean
  loading: boolean
  error: string | null
}

export function useVisitorCount() {
  const [data, setData] = useState<VisitorCountData>({
    count: 0,
    isNewVisitor: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchVisitorCount() {
      try {
        const response = await fetch("/api/visitor-count")
        const result = await response.json()

        if (result.success) {
          setData({
            count: result.count,
            isNewVisitor: result.isNewVisitor,
            loading: false,
            error: null,
          })
        } else {
          setData({
            count: 0,
            isNewVisitor: false,
            loading: false,
            error: result.error || "Failed to load visitor count",
          })
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error)
        setData({
          count: 0,
          isNewVisitor: false,
          loading: false,
          error: "Failed to load visitor count",
        })
      }
    }

    fetchVisitorCount()
  }, [])

  return data
}
