"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Document } from "@/types";
import { Trash2, FileText } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="py-2 text-xs text-gray-400">No documents uploaded yet.</p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      }}
      className="space-y-0.5"
    >
      {documents.map((doc) => (
        <motion.div
          key={doc.id}
          variants={{
            hidden: { opacity: 0, y: 4 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-700 truncate">{doc.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-gray-400">{formatBytes(doc.size)}</span>
            <button
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 active:scale-95"
              title="Delete"
            >
              {deletingId === doc.id ? (
                <Spinner className="h-3 w-3" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
