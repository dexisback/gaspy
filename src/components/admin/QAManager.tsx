"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QAPair } from "@/types";
import { Pencil, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

export function QAManager() {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [refreshKey]);

  useEffect(() => {
    function handleOpenAdd() {
      openAdd();
    }
    window.addEventListener("open-qa-add", handleOpenAdd);
    return () => window.removeEventListener("open-qa-add", handleOpenAdd);
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {/* List */}
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
          <p className="py-3 text-xs text-gray-400">No Q&A pairs yet.</p>
        )}
        {qaPairs.map((qa) => (
          <motion.div
            key={qa.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-xs text-gray-700 truncate pr-2">{qa.question}</span>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(qa)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors active:scale-95"
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDelete(qa.id)}
                disabled={actionLoadingId === qa.id}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-95"
                title="Delete"
              >
                {actionLoadingId === qa.id ? (
                  <Spinner className="h-3 w-3" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add button fixed in tile header — actually rendered in parent page. 
          We expose an onAdd callback? No, keep self-contained and let parent pass a trigger.
          Better: the page passes a header button. I'll make QAManager accept an onAddClick prop or 
          expose a ref? Simpler: page renders the + button and passes onAdd prop.
      */}

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
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {editingId ? "Edit Q&A Pair" : "Add Q&A Pair"}
                </h3>
                <button
                  onClick={closeModal}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm outline-none focus:border-gray-300 focus:bg-white transition-colors"
                />
                <textarea
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#171916] px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingId ? "Save Changes" : "Add Pair"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
