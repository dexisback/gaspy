"use client";

import { useEffect, useState } from "react";
import { AnalyticsItem } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : []))
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );

  if (data.length === 0)
    return (
      <p className="py-4 text-sm text-gray-500">
        No questions asked yet. Analytics will appear here once users start
        chatting.
      </p>
    );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold mb-3">Top Asked Questions</h3>
      {data.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3"
        >
          <span className="text-sm">{item.question}</span>
          <Badge className="ml-4 shrink-0">{item.count}x</Badge>
        </div>
      ))}
    </div>
  );
}
