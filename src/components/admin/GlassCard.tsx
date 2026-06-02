"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay }}
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.005,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }
          : undefined
      }
      className={`
        relative overflow-hidden rounded-2xl border
        bg-card text-card-foreground
        border-border
        backdrop-blur-xl
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.03),0_12px_24px_rgba(0,0,0,0.02)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),0_12px_24px_rgba(0,0,0,0.1)]
        transition-colors
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
