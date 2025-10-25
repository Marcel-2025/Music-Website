"use client"

import { useVisitorCount } from "@/hooks/use-visitor-count"
import { Eye, Loader2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function VisitorCounter() {
  const { count, isNewVisitor, loading, error } = useVisitorCount()

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading visitor count...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <Eye className="w-4 h-4" />
        <span className="text-sm">Visitor tracking unavailable</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <span className="text-lg font-semibold text-white">{count.toLocaleString()}</span>
        <span className="text-sm text-gray-400">Besucher</span>
      </div>
      {isNewVisitor && (
        <Badge variant="outline" className="text-xs text-green-400 border-green-400">
          🎉 Du bist Besucher #{count}!
        </Badge>
      )}
    </div>
  )
}
