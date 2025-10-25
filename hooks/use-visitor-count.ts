"use client"

import { useEffect, useState } from "react"

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0)
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch("/api/visitor-count")
        const data = await response.json()
        setCount(data.count)
        setIsNewVisitor(data.isNewVisitor)
      } catch (error) {
        console.error("Failed to fetch visitor count:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [])

  return { count, isNewVisitor, loading }
}
