"use client"

import { useState, useEffect } from "react"

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0)
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // First, get current count
        const getResponse = await fetch("/api/visitor-count")
        const getData = await getResponse.json()

        if (getData.isNewVisitor) {
          // If new visitor, increment the count
          const postResponse = await fetch("/api/visitor-count", {
            method: "POST",
          })
          const postData = await postResponse.json()
          setCount(postData.count)
          setIsNewVisitor(postData.isNewVisitor)
        } else {
          setCount(getData.count)
          setIsNewVisitor(false)
        }
      } catch (error) {
        console.error("Error tracking visitor:", error)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    trackVisitor()
  }, [])

  return { count, isNewVisitor, loading }
}
