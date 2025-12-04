"use client"

import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Eye, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function VisitorCounter() {
  const { count, isNewVisitor, loading } = useVisitorCount()

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading visitors...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-purple-400" />
        <span className="text-white font-semibold text-lg">{count.toLocaleString()}</span>
        <span className="text-gray-400 text-sm">Visitors</span>
      </div>
      {isNewVisitor && (
        <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
          🎉 Du bist Besucher #{count}!
        </Badge>
      )}
    </div>
  )
}
