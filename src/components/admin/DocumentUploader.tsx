"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadIcon } from "@/components/ui/upload";

interface DocumentUploaderProps {
  onUploaded: () => void;
  dragOver?: boolean;
}

export function DocumentUploader({ onUploaded, dragOver = false }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div onDrop={handleDrop}>
      <motion.button
        animate={
          dragOver
            ? {
                scale: 1.01,
                borderColor: "rgba(197, 248, 10, 0.7)",
                backgroundColor: "rgba(197, 248, 10, 0.06)",
              }
            : {
                scale: 1,
                borderColor: "rgba(0, 0, 0, 0.08)",
                backgroundColor: "rgba(0, 0, 0, 0)",
              }
        }
        transition={{ duration: 0.2 }}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-background/40 px-4 py-3 text-[12px] font-medium text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <UploadIcon size={14} className="opacity-80" />
        {uploading
          ? "Uploading & indexing…"
          : dragOver
          ? "Drop to upload"
          : "Upload document"}
      </motion.button>
      {uploading && (
        <div
          className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Uploading"
        >
          <div className="h-full w-1/3 animate-[shimmer-slide_1.2s_ease-in-out_infinite] rounded-full bg-accent/70" />
        </div>
      )}
      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
