/**
 * LoadingSkeleton - Skeleton loading placeholders for different content types
 */

export function TaskCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 border-l-4 border-l-white/10">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full skeleton mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton w-3/4" />
          <div className="h-3 skeleton w-1/2" />
          <div className="flex gap-2 mt-3">
            <div className="h-5 w-16 skeleton rounded-full" />
            <div className="h-5 w-16 skeleton rounded-full" />
            <div className="h-5 w-20 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 skeleton rounded-xl" />
      </div>
      <div className="h-8 skeleton w-16 mb-2" />
      <div className="h-3 skeleton w-20" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="h-4 skeleton w-32 mb-4" />
          <div className="h-24 skeleton rounded-xl" />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="h-4 skeleton w-32 mb-4" />
          <div className="space-y-3">
            <div className="h-2 skeleton rounded-full" />
            <div className="h-2 skeleton rounded-full" />
            <div className="h-2 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}
