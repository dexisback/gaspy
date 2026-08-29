"use client";

import { motion } from "framer-motion";

export function GradientArc() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className="pointer-events-none absolute bottom-[-120px] left-1/2 z-0 -translate-x-1/2"
      style={{
        width: "1000px",
        height: "420px",
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at center, rgba(197, 248, 10, 0.055) 0%, rgba(197, 248, 10, 0.025) 45%, rgba(197, 248, 10, 0) 70%)",
        filter: "blur(60px)",
      }}
    />
  );
}
