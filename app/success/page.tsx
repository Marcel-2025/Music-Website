import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Setup Complete!</h2>
        <p className="text-gray-300 mb-6">
          Your music release dashboard is now configured. You can view your latest releases and platform statistics.
        </p>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
