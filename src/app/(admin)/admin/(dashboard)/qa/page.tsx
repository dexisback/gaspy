import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PanelSurface } from "@/components/admin/PanelSurface";
import { QAManagerData, ListSkeleton } from "@/components/admin/DashboardData";

export const dynamic = "force-dynamic";

export default async function AdminQAPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4 md:px-8">
      <PageHeader
        title="Q&A Pairs"
        description="Manage custom question and answer context used by the chatbot."
      />
      <PanelSurface className="p-5">
        <Suspense fallback={<ListSkeleton rows={6} />}>
          <QAManagerData />
        </Suspense>
      </PanelSurface>
    </div>
  );
}
