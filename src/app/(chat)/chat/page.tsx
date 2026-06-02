"use client";

import { motion } from "framer-motion";
import { ChatPanel } from "@/components/chat/ChatPanel";

function BlogMockup() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
      <div className="mb-6 h-10 w-3/4 rounded bg-gray-300" />
      <div className="mb-8 h-64 w-full rounded-2xl bg-gray-200" />
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="mt-8 h-48 w-full rounded-2xl bg-gray-200" />
      <div className="mt-8 space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-white">
      {/* Blurred mock background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden blur-sm">
        <BlogMockup />
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/50" />

      {/* Chat Panel — centered, constrained to viewport */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="w-full max-w-[380px]"
        >
          <div className="max-h-[85vh]">
            <ChatPanel />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
