"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const platform = searchParams.get("platform") || "integration"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="mt-4 text-2xl">Setup Complete!</CardTitle>
          <CardDescription>Your {platform} integration has been successfully configured.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Remember to set your API keys and IDs as environment variables in Vercel for production deployments.
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          {platform === "youtube" && (
            <Button variant="outline" asChild>
              <Link href="/dashboard">Finish Setup</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
