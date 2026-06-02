"use client";

import { motion } from "framer-motion";

export function AnimatedTrashIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.g
        animate={
          open
            ? { rotate: -14, x: 0, y: -2.4 }
            : { rotate: 0, x: 0, y: 0 }
        }
        transition={{ type: "spring", duration: 0.22, bounce: 0 }}
        style={{ transformOrigin: "11px 7px" }}
      >
        <path
          d="M6 7H16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 4h2a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </motion.g>
      <path
        d="M6 7h10v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 10v7M14 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export function AnimatedPencilIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
