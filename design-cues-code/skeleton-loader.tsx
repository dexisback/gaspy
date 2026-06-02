//NOTE FOR KIMIK2.6: IMPLEMENT THIS KIND OF SKELETON LOADING ANIMATION

import { GlassLoadingShell } from "@/components/loading/glass-loading-shell";
import { PANEL_TEXTURE } from "@/components/loading/panel-texture";

/** Mirrors `todo-workspace-client.tsx` header, task list panel, D-day + goals stack. */
export default function TodoPageSkeleton() {
  return (
    <GlassLoadingShell>
      <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 pb-8 pt-2 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col space-y-6 pt-2">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="app-shimmer-block h-3.5 w-3.5 rounded-sm bg-muted/50" />
              <div className="app-shimmer-block h-3.5 w-14 rounded-md bg-muted/45 ring-1 ring-border/25" />
            </div>
            <div className="h-2.5 w-16 rounded bg-muted/35" />
          </div>

          <div className={`app-shimmer-block ${PANEL_TEXTURE} p-4`}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="h-2.5 w-28 rounded bg-muted/40" />
              <div className="h-7 w-7 rounded-[6px] bg-muted/50 ring-1 ring-border/30" />
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="app-shimmer-block flex min-h-[6rem] items-start gap-2 rounded-xl border border-border/50 bg-background/85 px-3 py-3"
                >
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border border-border/60 bg-muted/30" />
                  <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                    <div className="h-3.5 w-[55%] max-w-md rounded bg-muted/45" />
                    <div className="h-5 w-16 rounded-full bg-muted/40" />
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 pr-1">
                    <div className="h-7 w-7 rounded-[6px] bg-muted/35" />
                    <div className="h-7 w-7 rounded-[6px] bg-muted/35" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className={`app-shimmer-block ${PANEL_TEXTURE} p-4`}>
              <div className="mb-3 h-2.5 w-24 rounded bg-muted/40" />
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="h-20 rounded-md bg-muted/40 ring-1 ring-border/25" />
                <div className="h-20 rounded-md bg-muted/40 ring-1 ring-border/25" />
              </div>
              <div className="mt-2 h-2.5 w-12 rounded bg-muted/35" />
            </div>
            <div className={`app-shimmer-block ${PANEL_TEXTURE} p-4`}>
              <div className="mb-3 h-2.5 w-32 rounded bg-muted/40" />
              <div className="mb-2 h-2 w-28 rounded bg-muted/30" />
              <div className="mb-3 h-2 w-full rounded-full bg-muted/35" />
              <div className="h-2 w-32 rounded bg-muted/30" />
              <div className="mt-1 h-2 w-full rounded-full bg-muted/35" />
            </div>
          </div>
        </div>
      </div>
    </GlassLoadingShell>
  );
}
