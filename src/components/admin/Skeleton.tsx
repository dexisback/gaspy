"use client";

export function ChartSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-1">
      <div className="flex items-center justify-between">
        <div className="app-shimmer-block h-3 w-24 rounded bg-muted/50" />
        <div className="app-shimmer-block h-2.5 w-16 rounded bg-muted/40" />
      </div>
      <div className="flex-1">
        <div className="app-shimmer-block h-full w-full rounded-xl bg-muted/40" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 py-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="app-shimmer-block flex min-h-[3rem] items-center gap-3 rounded-lg border border-border/30 bg-background/60 px-3 py-2"
        >
          <div className="h-3.5 flex-1 rounded bg-muted/40" />
          <div className="h-3.5 w-8 shrink-0 rounded bg-muted/35" />
        </div>
      ))}
    </div>
  );
}

export function UploaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="app-shimmer-block h-24 w-full rounded-xl border-2 border-dashed border-border/30" />
      <div className="space-y-2">
        <div className="app-shimmer-block h-10 w-full rounded-lg bg-muted/40" />
        <div className="app-shimmer-block h-10 w-full rounded-lg bg-muted/40" />
      </div>
    </div>
  );
}
