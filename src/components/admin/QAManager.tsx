"use client";

import { useEffect, useState } from "react";
import { QAPair } from "@/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function QAManager() {
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      if (res.ok) {
        setQuestion("");
        setAnswer("");
        setRefreshKey((k) => k + 1);
      }
    } finally {
      setSaving(false);
    }
  }

  function startEdit(qa: QAPair) {
    setEditingId(qa.id);
    setEditQuestion(qa.question);
    setEditAnswer(qa.answer);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editQuestion.trim() || !editAnswer.trim()) return;
    setActionLoadingId(editingId);
    try {
      const res = await fetch(`/api/qa/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editQuestion, answer: editAnswer }),
      });
      if (res.ok) {
        cancelEdit();
        setRefreshKey((k) => k + 1);
      }
    } finally {
      setActionLoadingId(null);
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

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="space-y-3">
        <h3 className="text-sm font-semibold">Add New Q&A Pair</h3>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
        />
        <Button type="submit" loading={saving}>
          Add Q&A
        </Button>
      </form>

      <div className="space-y-3">
        {qaPairs.length === 0 && (
          <p className="text-sm text-gray-500">No Q&A pairs yet.</p>
        )}
        {qaPairs.map((qa) => (
          <div
            key={qa.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            {editingId === qa.id ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                />
                <textarea
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    loading={actionLoadingId === qa.id}
                  >
                    Save
                  </Button>
                  <Button variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="font-medium text-sm">Q: {qa.question}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  A: {qa.answer}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(qa)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    loading={actionLoadingId === qa.id}
                    onClick={() => handleDelete(qa.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
