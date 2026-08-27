"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

let messageSeq = 0;

function createMessage(role: Message["role"], content: string): Message {
  return { id: `m-${Date.now()}-${++messageSeq}`, role, content };
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    createMessage(
      "assistant",
      "Hey there! I'm Gaspy. Ask me anything about your documents."
    ),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Stop any in-flight stream before starting a new one.
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = createMessage("user", trimmed);
    const assistantMessage = createMessage("assistant", "");

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Chat failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage.content += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: assistantMessage.content }
              : m
          )
        );
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, content: `Error: ${msg}` } : m
        )
      );
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
        abortRef.current = null;
      }
    }
  }

  const lastMessage = messages[messages.length - 1];

  function handleStop() {
    abortRef.current?.abort();
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} index={i} />
          ))}

          <AnimatePresence>
            {isLoading && lastMessage?.role === "assistant" && lastMessage.content === "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl rounded-bl-md bg-[#F2F4F5] px-4 py-2">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="rounded-full bg-red-50 px-4 py-1.5 text-xs text-red-600">
                {error}
              </div>
            </motion.div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3">
        {isLoading && (
          <div className="mb-2 flex justify-center">
            <button
              onClick={handleStop}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] cursor-pointer"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
              Stop generating
            </button>
          </div>
        )}
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
