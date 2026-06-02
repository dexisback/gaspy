"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  label: string;
}

export function Tooltip({ children, label }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1F2937] px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-white shadow-lg"
          >
            {label}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 h-1.5 w-1.5 rotate-45 bg-[#1F2937]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
