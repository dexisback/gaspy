import { cache } from "react";
import { getAnalytics, getQAPairs, getDocuments } from "@/lib/admin-data";
import { AnalyticsChart } from "./AnalyticsChart";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { QAManager } from "./QAManager";
import { DocumentsSection } from "./DocumentsSection";
import { ChartSkeleton, ListSkeleton, UploaderSkeleton } from "./Skeleton";

const getAnalyticsCached = cache(getAnalytics);
const getQAPairsCached = cache(getQAPairs);
const getDocumentsCached = cache(getDocuments);

export { ChartSkeleton, ListSkeleton, UploaderSkeleton };

export async function AnalyticsChartData() {
  const { timeline } = await getAnalyticsCached();
  return <AnalyticsChart initialData={timeline} />;
}

export async function AnalyticsPanelData() {
  const { topQuestions } = await getAnalyticsCached();
  return <AnalyticsPanel initialData={topQuestions} />;
}

export async function QAManagerData() {
  const qaPairs = await getQAPairsCached();
  return <QAManager initialData={qaPairs} />;
}

export async function DocumentsData() {
  const documents = await getDocumentsCached();
  return <DocumentsSection initialData={documents} />;
}
