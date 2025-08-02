import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-950">
      <header className="sticky top-0 z-40 w-full border-b bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24 md:w-64" />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <section className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
