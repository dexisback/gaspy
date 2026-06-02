"use client";

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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/40 bg-[#1F2937] px-3 py-2 shadow-lg">
        <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-white/60">
          {label}
        </p>
        <p className="text-[13px] font-mono font-bold text-white mt-0.5">
          {payload[0].value} questions
        </p>
      </div>
    );
  }
  return null;
}

export function AnalyticsChart({ initialData }: AnalyticsChartProps) {
  const data = initialData || [];

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] font-medium text-muted-foreground/70">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-0 min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -4 }}>
          <defs>
            <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5F80A" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#C5F80A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: "var(--muted-foreground)",
              fontFamily: "var(--font-geist-mono)",
            }}
            interval={2}
            dy={4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: "var(--muted-foreground)",
              fontFamily: "var(--font-geist-mono)",
            }}
            width={24}
            dx={-4}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#C5F80A"
            strokeWidth={2}
            fill="url(#areaGreen)"
            dot={{ r: 3, fill: "var(--foreground)", stroke: "var(--background)", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#C5F80A", stroke: "var(--background)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
