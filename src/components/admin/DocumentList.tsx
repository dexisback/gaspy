"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Document } from "@/types";
import { FileTextIcon } from "@/components/ui/file-text";
import { formatBytes } from "@/lib/utils";
import { AnimatedTrashIcon } from "./AnimatedIcons";
import { UploaderSkeleton } from "./Skeleton";

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
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        <p className="text-[13px] font-semibold text-foreground">
          No knowledge sources yet
        </p>
        <p className="max-w-[280px] text-[12px] text-muted-foreground">
          Upload your first document to give the chatbot a knowledge base.
        </p>
      </div>
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
      className="divide-y divide-border/40"
    >
      {documents.map((doc) => {
        const chunks = doc.chunks ?? 0;
        const indexed = chunks > 0;
        return (
          <motion.div
            key={doc.id}
            variants={{
              hidden: { opacity: 0, y: 4 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-muted-foreground">
              <FileTextIcon size={14} className="opacity-60" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[13px] font-medium text-foreground" title={doc.name}>
                {doc.name}
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground/80 font-tabular">
                {doc.type.toUpperCase()} · {formatBytes(doc.size)}
                {indexed ? ` · ${chunks} chunks` : ""}
              </span>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider ${
                indexed
                  ? "border-accent/30 bg-accent/10 text-[#5d7a02] dark:text-[#C5F80A]"
                  : "border-border/50 bg-muted/40 text-muted-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  indexed ? "bg-accent" : "bg-muted-foreground/50"
                }`}
                aria-hidden
              />
              {indexed ? "Indexed" : "Empty"}
            </span>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onHoverStart={() => setHoveredDeleteId(doc.id)}
              onHoverEnd={() =>
                setHoveredDeleteId((prev) => (prev === doc.id ? null : prev))
              }
              onClick={() => handleDelete(doc.id)}
              disabled={deletingId === doc.id}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:bg-muted/70 hover:text-red-500 disabled:cursor-not-allowed opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 cursor-pointer"
              title="Delete"
              aria-label={`Delete ${doc.name}`}
            >
              {deletingId === doc.id ? (
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted" />
              ) : (
                <AnimatedTrashIcon open={hoveredDeleteId === doc.id} />
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
