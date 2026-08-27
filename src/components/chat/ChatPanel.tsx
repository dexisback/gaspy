"use client";

import { motion } from "framer-motion";
import { ChatWindow } from "./ChatWindow";

interface ChatPanelProps {
  onClose?: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="relative flex flex-col overflow-hidden rounded-3xl bg-white"
      style={{
        width: "min(380px, calc(100vw - 48px))",
        height: "min(540px, calc(100vh - 48px))",
        boxShadow: `
          0 0 0 1px rgba(0,0,0,0.06),
          0 4px 12px rgba(0,0,0,0.05),
          0 16px 48px rgba(0,0,0,0.08),
          0 32px 80px rgba(0,0,0,0.1)
        `,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171916]">
            <span className="text-[10px] font-bold text-white">G</span>
          </div>
          <span className="text-sm font-semibold text-[#171916]">Gaspy</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:scale-[0.92]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </motion.div>
  );
}
