import { Suspense } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { PanelSurface } from "@/components/admin/PanelSurface";
import {
  AnalyticsChartData,
  AnalyticsPanelData,
  QAManagerData,
  DocumentsData,
  ChartSkeleton,
  ListSkeleton,
  UploaderSkeleton,
} from "@/components/admin/DashboardData";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <TopBar />

        {/* Ambient glow */}
        <div className="pointer-events-none fixed bottom-0 left-1/2 z-0 -translate-x-1/2 opacity-30 dark:opacity-15">
          <div
            className="rounded-full blur-[120px]"
            style={{
              width: "700px",
              height: "300px",
              background: "rgba(197, 248, 10, 0.12)",
            }}
          />
        </div>

        {/* Dashboard Bento Grid */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
          <div className="grid grid-cols-12 gap-5">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
              {/* Chart — tall */}
              <PanelSurface className="flex flex-col p-6" delay={0.05}>
                <div className="mb-5 flex items-center justify-between shrink-0">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    Questions Over Time
                  </h3>
                  <span className="text-[10.5px] text-muted-foreground font-tabular">
                    Last 12 hours
                  </span>
                </div>
                <div className="h-[280px]">
                  <Suspense fallback={<ChartSkeleton />}>
                    <AnalyticsChartData />
                  </Suspense>
                </div>
              </PanelSurface>

              {/* Top Questions — compact */}
              <PanelSurface className="flex flex-col p-6" delay={0.1}>
                <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground shrink-0">
                  Top Questions
                </h3>
                <div className="min-h-[140px]">
                  <Suspense fallback={<ListSkeleton rows={5} />}>
                    <AnalyticsPanelData />
                  </Suspense>
                </div>
              </PanelSurface>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
              {/* Q&A — tall */}
              <PanelSurface className="flex flex-col p-6 flex-1 min-h-[380px]" delay={0.15}>
                <Suspense fallback={<ListSkeleton rows={8} />}>
                  <QAManagerData />
                </Suspense>
              </PanelSurface>

              {/* Documents — short strip */}
              <PanelSurface className="flex flex-col p-6" delay={0.2}>
                <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground shrink-0">
                  Documents
                </h3>
                <Suspense fallback={<UploaderSkeleton />}>
                  <DocumentsData />
                </Suspense>
              </PanelSurface>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
