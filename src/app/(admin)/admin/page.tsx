"use client";

import { useState } from "react";
import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { DocumentList } from "@/components/admin/DocumentList";
import { QAManager } from "@/components/admin/QAManager";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";

type Tab = "documents" | "qa" | "analytics";

const tabs: { key: Tab; label: string }[] = [
  { key: "documents", label: "Documents" },
  { key: "qa", label: "Q&A Pairs" },
  { key: "analytics", label: "Analytics" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("documents");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "documents" && (
        <div className="space-y-6">
          <DocumentUploader
            onUploaded={() => setRefreshKey((k) => k + 1)}
          />
          <DocumentList key={refreshKey} />
        </div>
      )}

      {activeTab === "qa" && <QAManager />}

      {activeTab === "analytics" && <AnalyticsPanel />}
    </div>
  );
}
