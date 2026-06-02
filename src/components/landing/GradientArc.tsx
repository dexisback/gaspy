"use client";

import { motion } from "framer-motion";

export function GradientArc() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2"
      style={{
        width: "900px",
        height: "650px",
        background: `
          radial-gradient(
            ellipse 80% 60% at 50% 100%,
            rgba(197, 248, 10, 0.10) 0%,
            rgba(197, 248, 10, 0.04) 40%,
            transparent 70%
          )
        `,
      }}
    />
  );
}
