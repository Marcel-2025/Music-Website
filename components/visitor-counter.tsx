"use client"

import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Eye, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function VisitorCounter() {
  const { count, isNewVisitor, loading, error } = useVisitorCount()

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading visitors...</span>
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-purple-400" />
        <span className="text-gray-300 text-sm">
          <span className="font-semibold text-white">{count.toLocaleString()}</span> Besucher
        </span>
      </div>
      {isNewVisitor && (
        <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
          Du bist Besucher #{count}! 🎉
        </Badge>
      )}
    </div>
  )
}
