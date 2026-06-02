"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Document } from "@/types";
import { Trash2, FileText } from "lucide-react";
import { UploaderSkeleton } from "./Skeleton";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export function DocumentList({ documents, onDelete, loading }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete?.(id);
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <UploaderSkeleton />;
  }

  if (documents.length === 0) {
    return (
      <p className="py-3 text-xs text-muted-foreground">No documents uploaded yet.</p>
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
      className="space-y-1"
    >
      {documents.map((doc) => (
        <motion.div
          key={doc.id}
          variants={{
            hidden: { opacity: 0, y: 4 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="flex items-center justify-between rounded-lg px-2.5 py-2 hover:bg-muted/60 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground truncate">{doc.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-muted-foreground font-tabular">
              {formatBytes(doc.size)}
            </span>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              {deletingId === doc.id ? (
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
