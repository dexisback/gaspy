"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QAPair } from "@/types";
import { PlusIcon } from "@/components/ui/plus";
import { XIcon } from "@/components/ui/x";
import { SearchIcon } from "@/components/ui/search";
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
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return qaPairs;
    return qaPairs.filter(
      (qa) =>
        qa.question.toLowerCase().includes(q) ||
        qa.answer.toLowerCase().includes(q)
    );
  }, [qaPairs, filter]);

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
          usage: 0,
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
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border/50 bg-background/60 px-2.5 transition-colors focus-within:border-ring/50 sm:max-w-xs">
          <SearchIcon size={12} className="shrink-0 opacity-50" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search Q&A..."
            className="w-full bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="ml-auto flex h-8 items-center gap-1.5 rounded-lg bg-[#1F2937] px-3 text-[12px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-150 hover:bg-[#2a3547] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] cursor-pointer dark:bg-[#C5F80A] dark:text-gray-900 dark:hover:bg-[#d4ff2e]"
        >
          <PlusIcon size={13} />
          Add Q&A
        </motion.button>
      </div>

      {/* Column labels */}
      {filtered.length > 0 && (
        <div className="mb-1 flex items-center gap-3 border-b border-border/50 px-3 pb-1.5">
          <span className="flex-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Question
          </span>
          <span className="hidden w-16 shrink-0 text-right font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
            Usage
          </span>
          <span className="w-16 shrink-0" aria-hidden />
        </div>
      )}

      {/* Rows */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
        className="divide-y divide-border/40"
      >
        {qaPairs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            <p className="text-[13px] font-semibold text-foreground">
              No Q&A pairs yet
            </p>
            <p className="max-w-xs text-[12px] text-muted-foreground">
              Add your first question and answer to give the chatbot custom
              context.
            </p>
            <button
              onClick={openAdd}
              className="mt-1 text-[12px] font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 cursor-pointer"
            >
              Add Q&A
            </button>
          </div>
        )}

        {qaPairs.length > 0 && filtered.length === 0 && (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            No matches for “{filter}”.
          </p>
        )}

        {filtered.map((qa) => (
          <motion.div
            key={qa.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40 ${
              savingRowId === qa.id ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p
                className="truncate text-[13px] font-semibold text-foreground"
                title={qa.question}
              >
                {qa.question}
              </p>
              <p className="truncate text-[11.5px] text-muted-foreground" title={qa.answer}>
                {qa.answer}
              </p>
            </div>

            <span
              className="hidden w-16 shrink-0 text-right font-mono text-[11px] font-semibold text-muted-foreground font-tabular sm:block"
              title={`${qa.usage ?? 0} matching logged questions`}
            >
              {qa.usage ? `×${qa.usage}` : "—"}
            </span>

            <div className="flex w-16 shrink-0 items-center justify-end gap-0.5 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => openEdit(qa)}
                disabled={savingRowId === qa.id}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground cursor-pointer disabled:opacity-40"
                aria-label={`Edit ${qa.question}`}
              >
                <AnimatedPencilIcon />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onHoverStart={() => setHoveredDeleteId(qa.id)}
                onHoverEnd={() =>
                  setHoveredDeleteId((prev) =>
                    prev === qa.id ? null : prev
                  )
                }
                onClick={() => void handleDelete(qa.id)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/70 hover:text-red-500 cursor-pointer"
                aria-label={`Delete ${qa.question}`}
              >
                <AnimatedTrashIcon open={hoveredDeleteId === qa.id} />
              </motion.button>
            </div>

            {/* Slice sweep animation */}
            <AnimatePresence>
              {slicedId === qa.id && (
                <motion.span
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 0.9, x: 260 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0, 0, 0.58, 1] }}
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/25 p-4"
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
                <h2 className="text-[14px] font-bold text-foreground">
                  {editingId ? "Edit Q&A Pair" : "Add Q&A Pair"}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={closeModal}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer"
                  aria-label="Close"
                >
                  <XIcon size={14} className="opacity-80" />
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
                    className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring/50 transition-colors"
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
                    className="w-full resize-none rounded-lg border border-border/70 bg-background px-3 py-2.5 text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring/50 transition-colors"
                  />
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-lg border border-border/70 bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.96 }}
                    disabled={saving || !question.trim() || !answer.trim()}
                    className="rounded-lg bg-[#1F2937] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#2a3547] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C5F80A] dark:text-gray-900 dark:hover:bg-[#d4ff2e]"
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
