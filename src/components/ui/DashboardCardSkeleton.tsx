// DashboardCardSkeleton.tsx
export function DashboardCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-white p-4 shadow-sm dark:bg-muted"
        >
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
