"use client";

import { useState, useCallback } from "react";
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
      <DocumentUploader onUploaded={refresh} dragOver={dragOver} />
      <div className="mt-4 overflow-y-auto max-h-[140px]">
        <DocumentList
          documents={documents}
          onDelete={refresh}
          loading={loading}
        />
      </div>
    </div>
  );
}
