import {
  getAnalytics,
  getDocuments,
  getKpis,
  getRecentActivity,
} from "@/lib/admin-data";
import { OverviewBoard } from "@/components/admin/OverviewBoard";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [kpis, analytics, activity, documents] = await Promise.all([
    getKpis(),
    getAnalytics("7d"),
    getRecentActivity(),
    getDocuments(),
  ]);

  return (
    <OverviewBoard
      kpis={kpis}
      topQuestions={analytics.topQuestions}
      activity={activity}
      documents={documents}
      initialTimeline={analytics.timeline}
    />
  );
}
