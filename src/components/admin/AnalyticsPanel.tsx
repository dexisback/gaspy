"use client";

import { motion } from "framer-motion";
import { AnalyticsItem } from "@/types";

interface AnalyticsPanelProps {
  initialData?: AnalyticsItem[];
}

export function AnalyticsPanel({ initialData }: AnalyticsPanelProps) {
  const data = initialData || [];

  if (data.length === 0) {
    return (
      <p className="py-4 text-[13px] font-medium text-muted-foreground text-pretty">
        No questions asked yet. Analytics will appear once users start chatting.
      </p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      }}
      className="space-y-0.5"
    >
      {data.slice(0, 8).map((item, i) => (
        <motion.div
          key={`${item.question}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="flex items-center justify-between rounded-lg px-2.5 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <span className="text-[13px] font-medium text-foreground truncate pr-3">
            {item.question}
          </span>
          <span className="shrink-0 inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-mono text-[10.5px] font-bold text-foreground font-tabular">
            {item.count}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
