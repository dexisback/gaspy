"use client";

import { useState, FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 px-1">
      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask Gaspy..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none rounded-full border border-gray-200 bg-white px-4 py-2.5 text-[13px] text-[#171916] placeholder-gray-400 transition-colors duration-150 focus:border-gray-400 focus:outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#1c1a18] dark:text-[#f0efee] dark:placeholder-gray-500 dark:focus:border-white/30"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#171916] text-white transition-all duration-150 hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-[#171916] active:scale-[0.94] dark:bg-[#C5F80A] dark:text-[#171717] dark:hover:bg-[#d4ff2e] dark:disabled:hover:bg-[#C5F80A]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </form>
  );
}
