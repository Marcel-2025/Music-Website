import { Skeleton } from "@/components/ui/skeleton"

export default function SetupYoutubeLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-background p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-10 w-1/2" />
          <Skeleton className="mx-auto h-4 w-3/4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
