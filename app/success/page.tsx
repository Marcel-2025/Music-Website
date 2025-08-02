"use client"

import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-green-400">Setup Complete!</CardTitle>
          <CardDescription className="text-center text-gray-400">Your integrations are now set up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
          <p className="text-lg text-gray-300">You&apos;re all set to explore your music release data.</p>
          <Link href="/dashboard">
            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
              Go to Dashboard
            </Button>
          </Link>
          <p className="text-sm text-gray-500">Remember to deploy your changes to Vercel for live data.</p>
        </CardContent>
      </Card>
    </div>
  )
}
