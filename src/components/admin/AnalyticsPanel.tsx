"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnalyticsResponse } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsResponse["topQuestions"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : { topQuestions: [] }))
      .then((json: AnalyticsResponse) => setData(json.topQuestions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="h-4 w-4 text-gray-400" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="py-3 text-xs text-gray-400">
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
      className="space-y-1"
    >
      {data.slice(0, 8).map((item, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xs text-gray-700 truncate pr-3">{item.question}</span>
          <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
            {item.count}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
