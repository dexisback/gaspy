import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PanelSurface } from "@/components/admin/PanelSurface";
import { DocumentsData, UploaderSkeleton } from "@/components/admin/DashboardData";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4 md:px-8">
      <PageHeader
        title="Knowledge Base"
        description="Documents powering the chatbot's RAG retrieval pipeline."
      />
      <PanelSurface className="p-5">
        <p className="mb-4 border-b border-border/50 pb-3 text-[12.5px] text-muted-foreground">
          These sources are indexed and used as retrieval context for chatbot
          responses.
        </p>
        <Suspense fallback={<UploaderSkeleton />}>
          <DocumentsData />
        </Suspense>
      </PanelSurface>
    </div>
  );
}
