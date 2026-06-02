"use client";

function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent dark:via-white/10" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-1">
      <div className="flex items-center justify-between">
        <ShimmerBlock className="h-4 w-32" />
        <ShimmerBlock className="h-3 w-20" />
      </div>
      <div className="flex-1">
        <ShimmerBlock className="h-full w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 py-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <ShimmerBlock className="h-3.5 flex-1" />
          <ShimmerBlock className="h-3.5 w-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function UploaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <ShimmerBlock className="h-24 w-full rounded-xl border-2 border-dashed border-border" />
      <div className="space-y-2">
        <ShimmerBlock className="h-8 w-full" />
        <ShimmerBlock className="h-8 w-full" />
      </div>
    </div>
  );
}
