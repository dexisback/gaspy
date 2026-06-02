import { Suspense } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { GlassCard } from "@/components/admin/GlassCard";
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 opacity-40 dark:opacity-25">
          <div
            className="rounded-full blur-[100px]"
            style={{
              width: "800px",
              height: "350px",
              background: "rgba(197, 248, 10, 0.15)",
            }}
          />
        </div>

        {/* Dashboard Grid */}
        <div className="relative z-10 flex flex-1 gap-6 p-6 md:gap-8 md:p-8 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-6 md:gap-8 min-w-0">
            {/* Chart */}
            <GlassCard className="flex-[3] flex flex-col p-5 md:p-6" delay={0.05}>
              <div className="mb-4 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-foreground text-balance tracking-tight">
                  Questions Over Time
                </h3>
                <span className="text-xs text-muted-foreground font-tabular">
                  Last 12 hours
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <Suspense fallback={<ChartSkeleton />}>
                  <AnalyticsChartData />
                </Suspense>
              </div>
            </GlassCard>

            {/* Top Questions */}
            <GlassCard className="flex-[2] flex flex-col p-5 md:p-6" delay={0.1}>
              <h3 className="mb-4 text-sm font-semibold text-foreground text-balance tracking-tight shrink-0">
                Top Questions
              </h3>
              <div className="flex-1 overflow-y-auto min-h-0">
                <Suspense fallback={<ListSkeleton rows={6} />}>
                  <AnalyticsPanelData />
                </Suspense>
              </div>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-6 md:gap-8 min-w-0">
            {/* Q&A */}
            <GlassCard className="flex-[5] flex flex-col p-5 md:p-6" delay={0.15}>
              <Suspense fallback={<ListSkeleton rows={8} />}>
                <QAManagerData />
              </Suspense>
            </GlassCard>

            {/* Documents */}
            <GlassCard className="flex-[2] flex flex-col p-5 md:p-6" delay={0.2}>
              <h3 className="mb-4 text-sm font-semibold text-foreground text-balance tracking-tight shrink-0">
                Documents
              </h3>
              <Suspense fallback={<UploaderSkeleton />}>
                <DocumentsData />
              </Suspense>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
