"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! I'm Gaspy. Ask me anything about your documents.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(message: string) {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: message.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
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

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...assistantMessage };
          return next;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      assistantMessage.content = `Error: ${msg}`;
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...assistantMessage };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} index={i} />
          ))}

          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.content === "" && (
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
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
