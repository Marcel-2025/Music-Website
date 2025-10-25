"use client"

import { Eye } from "lucide-react"
import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Badge } from "@/components/ui/badge"

export function VisitorCounter() {
  const { count, isNewVisitor, loading } = useVisitorCount()

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Eye className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-purple-400" />
        <span className="text-gray-300 text-sm md:text-base">
          <strong className="text-white">{count.toLocaleString()}</strong> total visitors
        </span>
      </div>
      {isNewVisitor && (
        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
          Welcome! You are visitor #{count}
        </Badge>
      )}
    </div>
  )
}
