"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsResponse } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export function AnalyticsChart() {
  const [data, setData] = useState<AnalyticsResponse["timeline"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : { timeline: [] }))
      .then((json: AnalyticsResponse) => setData(json.timeline || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5F80A" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#C5F80A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            interval={2}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            width={28}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #f3f4f6",
              fontSize: "12px",
              padding: "6px 10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#C5F80A"
            strokeWidth={2}
            fill="url(#areaGreen)"
            dot={{ r: 3, fill: "#171916", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#C5F80A", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
