"use client"

import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Eye } from "lucide-react"

export function VisitorCounter() {
  const { count, isNewVisitor, loading } = useVisitorCount()

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{count.toLocaleString()} Besucher</span>
      </div>
      {isNewVisitor && (
        <span className="text-xs text-primary animate-in fade-in duration-500">Du bist Besucher #{count}! 🎉</span>
      )}
    </div>
  )
}
