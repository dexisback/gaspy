"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PanelSurfaceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PanelSurface({
  children,
  className = "",
  delay = 0,
}: PanelSurfaceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay }}
      className={`
        app-surface
        relative overflow-hidden rounded-2xl
        border border-border/30
        bg-card
        shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_8px_rgba(0,0,0,0.02)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
