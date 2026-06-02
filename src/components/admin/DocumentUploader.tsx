"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

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
                rotate: [0, -1.5, 1.5, -1, 1, 0],
                scale: 1.02,
                borderColor: "rgba(197, 248, 10, 0.6)",
              }
            : { rotate: 0, scale: 1, borderColor: "rgba(0, 0, 0, 0.06)" }
        }
        transition={
          dragOver
            ? {
                rotate: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
                scale: { duration: 0.2 },
                borderColor: { duration: 0.2 },
              }
            : { duration: 0.2 }
        }
        onClick={() => inputRef.current?.click()}
        className="app-btn-3d flex w-full items-center justify-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload size={14} strokeWidth={1.5} className="opacity-80" />
        {uploading ? "Uploading..." : dragOver ? "Drop to upload" : "Upload document"}
      </motion.button>
      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
