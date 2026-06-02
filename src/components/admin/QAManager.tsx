"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QAPair } from "@/types";
import { Plus, X } from "lucide-react";
import { AnimatedTrashIcon, AnimatedPencilIcon } from "./AnimatedIcons";

interface QAManagerProps {
  initialData?: QAPair[];
}

export function QAManager({ initialData }: QAManagerProps) {
  const [qaPairs, setQaPairs] = useState<QAPair[]>(initialData || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [slicedId, setSlicedId] = useState<string | null>(null);
  const [hoveredDeleteId, setHoveredDeleteId] = useState<string | null>(null);

  function openAdd() {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setModalOpen(true);
  }

  function openEdit(qa: QAPair) {
    setEditingId(qa.id);
    setQuestion(qa.question);
    setAnswer(qa.answer);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setQuestion("");
    setAnswer("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);

    try {
      if (editingId) {
        // Edit: show row-level loading
        setSavingRowId(editingId);
        const res = await fetch(`/api/qa/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (res.ok) {
          const updated = await res.json();
          setQaPairs((prev) =>
            prev.map((qa) => (qa.id === editingId ? updated : qa))
          );
          closeModal();
        }
        setSavingRowId(null);
      } else {
        // Create: optimistically add
        const optimisticId = `temp-${Date.now()}`;
        const optimisticPair: QAPair = {
          id: optimisticId,
          question: question.trim(),
          answer: answer.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setQaPairs((prev) => [optimisticPair, ...prev]);
        closeModal();

        const res = await fetch("/api/qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (res.ok) {
          const created = await res.json();
          setQaPairs((prev) =>
            prev.map((qa) => (qa.id === optimisticId ? created : qa))
          );
        } else {
          // Revert on failure
          setQaPairs((prev) => prev.filter((qa) => qa.id !== optimisticId));
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSlicedId(id);
    setTimeout(() => {
      setSlicedId(null);
      setQaPairs((prev) => prev.filter((qa) => qa.id !== id));
    }, 240);

    try {
      await fetch(`/api/qa/${id}`, { method: "DELETE" });
    } catch {
      // silently fail, UI already updated
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Q&A Pairs
        </h3>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={openAdd}
          className="app-btn-3d flex h-7 w-7 items-center justify-center rounded-[6px] bg-background text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
          title="Add Q&A Pair"
        >
          <Plus size={14} strokeWidth={1.5} className="opacity-80" />
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
        className="space-y-2"
      >
        {qaPairs.length === 0 && (
          <p className="py-6 text-[13px] font-medium text-muted-foreground text-pretty text-center">
            No Q&A pairs yet.
          </p>
        )}
        {qaPairs.map((qa) => (
          <motion.div
            key={qa.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`relative flex min-h-[4.5rem] items-start gap-2 rounded-xl border border-border/40 bg-background/70 px-3 py-3 ${
              savingRowId === qa.id ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-[13px] font-semibold text-[#1c1917] truncate">
                {qa.question}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                {qa.answer}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-1 pr-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => openEdit(qa)}
                disabled={savingRowId === qa.id}
                className="group relative flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted/60 cursor-pointer disabled:opacity-40"
                aria-label="Edit"
              >
                <AnimatedPencilIcon />
                <motion.span
                  className="pointer-events-none absolute -bottom-0.5 left-1/2 h-[1.5px] w-3 -translate-x-1/2 rounded-full bg-current opacity-0"
                  initial={false}
                  whileHover={{ opacity: 0.55, scaleX: [0.2, 1] }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onHoverStart={() => setHoveredDeleteId(qa.id)}
                onHoverEnd={() =>
                  setHoveredDeleteId((prev) =>
                    prev === qa.id ? null : prev
                  )
                }
                onClick={() => void handleDelete(qa.id)}
                className="relative flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted/60 cursor-pointer"
                aria-label="Delete"
              >
                <AnimatedTrashIcon open={hoveredDeleteId === qa.id} />
              </motion.button>
            </div>

            {/* Slice sweep animation */}
            <AnimatePresence>
              {slicedId === qa.id && (
                <motion.span
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 0.9, x: 150 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0, 0, 0.58, 1] }}
                  className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/5 via-white/70 to-white/5 dark:from-white/5 dark:via-white/30 dark:to-white/5"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/25"
            style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 8, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.58, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md rounded-xl border border-border/60 bg-card p-5 shadow-[0_1px_2px_rgba(17,24,39,0.06),0_18px_40px_rgba(17,24,39,0.12)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#1c1917]">
                  {editingId ? "Edit Q&A Pair" : "Add Q&A Pair"}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={closeModal}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer"
                  aria-label="Close"
                >
                  <X size={14} strokeWidth={1.5} className="opacity-80" />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Question
                  </span>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter question"
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2.5 text-[13px] font-medium text-[#1c1917] outline-none placeholder:text-muted-foreground/50 focus:border-ring/40 transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Answer
                  </span>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={4}
                    placeholder="Enter answer"
                    className="w-full resize-none rounded-md border border-border/70 bg-background px-3 py-2.5 text-[13px] font-medium text-[#1c1917] outline-none placeholder:text-muted-foreground/50 focus:border-ring/40 transition-colors"
                  />
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-[6px] border border-border/70 bg-background px-3 py-1.5 text-[11px] font-semibold text-[#1c1917] hover:bg-muted/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.96 }}
                    disabled={saving || !question.trim() || !answer.trim()}
                    className="app-btn-3d rounded-[6px] bg-[#1F2937] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1F2937]/85 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Add Pair"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
