"use client";

import { motion } from "framer-motion";

export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: 0.4,
      }}
      className="relative z-10"
    >
      {/* Phone Frame */}
      <div
        className="relative flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[48px] border-[8px] border-gray-900 bg-white"
        style={{
          boxShadow: `
            0 0 0 1px rgba(0,0,0,0.1),
            0 4px 12px rgba(0,0,0,0.08),
            0 16px 48px rgba(0,0,0,0.12),
            0 0 80px rgba(197,248,10,0.15)
          `,
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />

        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-2 text-xs font-medium text-gray-900">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
            <div className="h-2 w-5 rounded-sm bg-gray-900" />
          </div>
        </div>

        {/* Blank Screen Area */}
        <div className="mt-4 flex-1 rounded-[40px] bg-white" />
      </div>

      {/* Side Buttons (decorative) */}
      <div className="absolute -left-[10px] top-24 h-8 w-[2px] rounded-l bg-gray-800" />
      <div className="absolute -left-[10px] top-36 h-14 w-[2px] rounded-l bg-gray-800" />
      <div className="absolute -left-[10px] top-52 h-14 w-[2px] rounded-l bg-gray-800" />
      <div className="absolute -right-[10px] top-40 h-20 w-[2px] rounded-r bg-gray-800" />
    </motion.div>
  );
}
