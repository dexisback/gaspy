"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimelinePoint } from "@/types";

interface AnalyticsChartProps {
  initialData?: TimelinePoint[];
}

export function AnalyticsChart({ initialData }: AnalyticsChartProps) {
  const data = initialData || [];

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] font-medium text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5F80A" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#C5F80A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            interval={2}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            width={28}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: "12px",
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#C5F80A"
            strokeWidth={2}
            fill="url(#areaGreen)"
            dot={{ r: 3, fill: "var(--foreground)", stroke: "var(--background)", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#C5F80A", stroke: "var(--background)", strokeWidth: 2 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
