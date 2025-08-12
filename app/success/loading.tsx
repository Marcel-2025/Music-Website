import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-64 mx-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </CardContent>
      </Card>
    </div>
  )
}
