"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QAPair } from "@/types";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import { ListSkeleton } from "./Skeleton";

interface QAManagerProps {
  initialData?: QAPair[];
}

export function QAManager({ initialData }: QAManagerProps) {
  const [qaPairs, setQaPairs] = useState<QAPair[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  useEffect(() => {
    if (refreshKey === 0 && initialData && initialData.length > 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/qa")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setQaPairs(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/qa/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (res.ok) {
          closeModal();
          setRefreshKey((k) => k + 1);
        }
      } else {
        const res = await fetch("/api/qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (res.ok) {
          closeModal();
          setRefreshKey((k) => k + 1);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/qa/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQaPairs((prev) => prev.filter((qa) => qa.id !== id));
      }
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-foreground text-balance tracking-tight">
          Q&A Pairs
        </h3>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={openAdd}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors"
          title="Add Q&A Pair"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <ListSkeleton rows={6} />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
          }}
          className="space-y-0.5"
        >
          {qaPairs.length === 0 && (
            <p className="py-3 text-xs text-muted-foreground">No Q&A pairs yet.</p>
          )}
          {qaPairs.map((qa) => (
            <motion.div
              key={qa.id}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 hover:bg-muted/60 transition-colors group"
            >
              <span className="text-xs text-foreground truncate pr-2">
                {qa.question}
              </span>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openEdit(qa)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleDelete(qa.id)}
                  disabled={actionLoadingId === qa.id}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  {actionLoadingId === qa.id ? (
                    <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-popover p-6 shadow-2xl border border-border backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-popover-foreground">
                  {editingId ? "Edit Q&A Pair" : "Add Q&A Pair"}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={closeModal}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring/50 focus:bg-card transition-colors"
                />
                <textarea
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring/50 focus:bg-card transition-colors resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={closeModal}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.96 }}
                    disabled={saving}
                    className="rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/80 transition-colors disabled:opacity-50"
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
