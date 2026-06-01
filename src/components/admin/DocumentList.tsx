"use client";

import { useEffect, useState } from "react";
import { Document } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/documents")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setDocuments(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );

  if (documents.length === 0)
    return (
      <p className="py-4 text-sm text-gray-500">No documents uploaded yet.</p>
    );

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">{doc.name}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <Badge>{doc.type || "unknown"}</Badge>
              <span>{formatBytes(doc.size)}</span>
              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            variant="danger"
            className="ml-4 shrink-0"
            loading={deletingId === doc.id}
            onClick={() => handleDelete(doc.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
