import { Loader2 } from "lucide-react"

export default function SetupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <p className="text-white ml-4">Loading Spotify setup page...</p>
    </div>
  )
}
