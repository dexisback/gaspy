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
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        <p className="text-[13px] font-semibold text-foreground">
          No questions yet
        </p>
        <p className="max-w-[240px] text-[12px] text-muted-foreground">
          Analytics will appear once users start chatting with the bot.
        </p>
      </div>
    );
  }

  return (
    <motion.ol
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      }}
      className="divide-y divide-border/40"
    >
      {data.map((item, i) => (
        <motion.li
          key={`${item.question}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
        >
          <span className="w-6 shrink-0 font-mono text-[10.5px] font-semibold text-muted-foreground/60 font-tabular group-hover:text-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground"
            title={item.question}
          >
            {item.question}
          </span>
          <span className="shrink-0 font-mono text-[11px] font-semibold text-muted-foreground font-tabular group-hover:text-foreground">
            {item.count}
          </span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
