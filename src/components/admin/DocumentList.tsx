"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Document } from "@/types";
import { FileText } from "lucide-react";
import { AnimatedTrashIcon } from "./AnimatedIcons";
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
  const [hoveredDeleteId, setHoveredDeleteId] = useState<string | null>(null);

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
      <p className="py-4 text-[13px] font-medium text-muted-foreground">
        No documents uploaded yet.
      </p>
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
          className="flex items-center justify-between rounded-lg px-2.5 py-2.5 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <FileText
              className="text-muted-foreground shrink-0 opacity-55"
              size={14}
              strokeWidth={1.6}
            />
            <span className="text-[13px] font-medium text-[#1c1917] truncate">{doc.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[10.5px] font-semibold text-muted-foreground/70 font-tabular">
              {formatBytes(doc.size)}
            </span>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onHoverStart={() => setHoveredDeleteId(doc.id)}
              onHoverEnd={() => setHoveredDeleteId((prev) => prev === doc.id ? null : prev)}
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted/60 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer disabled:cursor-not-allowed"
              title="Delete"
            >
              {deletingId === doc.id ? (
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted" />
              ) : (
                <AnimatedTrashIcon open={hoveredDeleteId === doc.id} />
              )}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
