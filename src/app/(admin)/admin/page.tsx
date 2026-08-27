import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-guard";
import { AccessDenied } from "@/components/admin/AccessDenied";
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

export default async function AdminPage() {
  // Server-side auth: unauthenticated → login, authenticated non-admin → denied
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.user.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <TopBar />

        {/* Ambient glow */}
        <div className="pointer-events-none fixed bottom-0 left-1/2 z-0 -translate-x-1/2 opacity-25 dark:opacity-20">
          <div
            className="rounded-full blur-[140px]"
            style={{
              width: "600px",
              height: "250px",
              background: "rgba(197, 248, 10, 0.14)",
            }}
          />
        </div>

        {/* Dashboard Bento Grid */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-40 pt-6">
          <div className="grid grid-cols-12 gap-x-8 gap-y-7">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-7">
              {/* Chart — tall */}
              <PanelSurface className="flex flex-col p-6" delay={0.05}>
                <div className="mb-5 flex items-center justify-between shrink-0">
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground text-balance">
                    Questions Over Time
                  </h3>
                  <span className="font-mono text-[10px] font-medium text-muted-foreground/70 font-tabular">
                    Last 12 hours
                  </span>
                </div>
                <div className="relative h-[240px] min-h-0 flex-shrink-0 w-full">
                  <Suspense fallback={<ChartSkeleton />}>
                    <AnalyticsChartData />
                  </Suspense>
                </div>
              </PanelSurface>

              {/* Top Questions — compact */}
              <PanelSurface className="flex flex-col p-6" delay={0.1}>
                <h3 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground text-balance shrink-0">
                  Top Questions
                </h3>
                <div className="min-h-[120px]">
                  <Suspense fallback={<ListSkeleton rows={5} />}>
                    <AnalyticsPanelData />
                  </Suspense>
                </div>
              </PanelSurface>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-7">
              {/* Q&A — medium height */}
              <PanelSurface className="flex flex-col p-6 min-h-[280px]" delay={0.15}>
                <Suspense fallback={<ListSkeleton rows={6} />}>
                  <QAManagerData />
                </Suspense>
              </PanelSurface>

              {/* Documents — thin pill strip */}
              <PanelSurface className="flex flex-col p-5" delay={0.2}>
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground text-balance shrink-0">
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
