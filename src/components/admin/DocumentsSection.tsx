"use client";

import { useCallback, useMemo, useState } from "react";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentList } from "./DocumentList";
import { Document } from "@/types";

export function DocumentsSection({ initialData }: { initialData: Document[] }) {
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const indexedCount = useMemo(
    () => documents.filter((d) => (d.chunks ?? 0) > 0).length,
    [documents]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
    >
      <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {documents.length} {documents.length === 1 ? "source" : "sources"} ·{" "}
        {indexedCount} indexed
      </p>

      <DocumentUploader onUploaded={refresh} dragOver={dragOver} />

      <div className="mt-2">
        <DocumentList
          documents={documents}
          onDelete={refresh}
          loading={loading}
        />
      </div>
    </div>
  );
}
