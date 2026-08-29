import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PanelSurface } from "@/components/admin/PanelSurface";
import {
  AnalyticsChartData,
  AnalyticsPanelData,
  ChartSkeleton,
  ListSkeleton,
} from "@/components/admin/DashboardData";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4 md:px-8">
      <PageHeader
        title="Analytics"
        description="Understand how users are interacting with the chatbot."
      />

      <div className="flex flex-col gap-4">
        <PanelSurface className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-foreground">
              Questions Over Time
            </h3>
            <span className="rounded-md border border-border/50 bg-card px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              Last 12 hours
            </span>
          </div>
          <div className="relative h-[260px] w-full">
            <Suspense fallback={<ChartSkeleton />}>
              <AnalyticsChartData />
            </Suspense>
          </div>
        </PanelSurface>

        <PanelSurface className="flex flex-col p-5">
          <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">
            Most Asked Questions
          </h3>
          <Suspense fallback={<ListSkeleton rows={8} />}>
            <AnalyticsPanelData />
          </Suspense>
        </PanelSurface>
      </div>
    </div>
  );
}
