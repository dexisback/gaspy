"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

export function DocumentUploader({ onUploaded }: { onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
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
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <motion.div
        whileTap={{ scale: 0.99 }}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-muted-foreground/30 hover:bg-muted/40"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground font-medium">
          {uploading ? "Uploading..." : "Drop a file or click to browse"}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/60">PDF, DOCX, XLSX</p>
      </motion.div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
