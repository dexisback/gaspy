"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUp, Plus, User } from "lucide-react";

type FloatCardProps = {
  className?: string;
  duration: string;
  delay: string;
  floatY: string;
  rotate: string;
  entranceDelay: number;
  children: ReactNode;
};

function FloatCard({
  className = "",
  duration,
  delay,
  floatY,
  rotate,
  entranceDelay,
  children,
}: FloatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: entranceDelay }}
      className={`hero-card pointer-events-auto absolute z-0 hidden lg:block ${className}`}
    >
      <div
        className="hero-float"
        style={
          {
            "--float-duration": duration,
            "--float-delay": delay,
            "--float-y": floatY,
            "--float-rotate": rotate,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </motion.div>
  );
}

const cardSurface =
  "rounded-xl border border-black/[0.06] bg-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-8px_rgba(0,0,0,0.10)] backdrop-blur-[2px] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-black/[0.10] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_18px_44px_-10px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#1c1a18]/90";

const labelClass = "text-[10px] font-medium text-gray-400 dark:text-gray-500";

function Sparkline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 24"
      fill="none"
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M2 18L12 15L22 16.5L32 10L42 12L52 5L62 6"
        stroke="#C5F80A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="hero-spark-sweep"
        d="M2 18L12 15L22 16.5L32 10L42 12L52 5L62 6"
        stroke="#a3ce0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function NewLeadCard() {
  return (
    <div className={`w-44 p-3.5 text-left ${cardSurface}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="hero-status-pulse flex h-4 w-4 items-center justify-center rounded-full bg-[#C5F80A]/20">
            <User className="h-2.5 w-2.5 text-[#7da504]" strokeWidth={2.5} />
          </span>
          <span className={labelClass}>New Lead</span>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-black/[0.06] bg-white text-gray-400 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Plus className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        Acme Corp.
      </p>
      <p className={labelClass}>Software · 50+ employees</p>
    </div>
  );
}

function DealWonCard() {
  return (
    <div className={`w-44 p-3.5 text-left ${cardSurface}`}>
      <p className={labelClass}>Deal Won</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-bold tracking-tight text-gray-900 font-tabular dark:text-gray-50">
          $24,800
        </p>
        <Sparkline className="h-6 w-16 shrink-0 opacity-90" />
      </div>
    </div>
  );
}

function PipelineValueCard() {
  return (
    <div className={`w-48 p-3.5 text-left ${cardSurface}`}>
      <p className={labelClass}>Pipeline Value</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-lg font-bold tracking-tight text-gray-900 font-tabular dark:text-gray-50">
          $124.8K
        </p>
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#84cc16]">
          <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
          12.4%
        </span>
      </div>
      <p className={labelClass}>vs last month</p>
      <svg
        viewBox="0 0 160 40"
        fill="none"
        className="mt-2 h-9 w-full"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          d="M2 33C18 31 26 24 42 26s26 7 44-4 34-14 72-12V40H2Z"
          fill="#C5F80A"
          opacity="0.1"
        />
        <path
          d="M2 33C18 31 26 24 42 26s26 7 44-4 34-14 72-12"
          stroke="#C5F80A"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="hero-chart-sweep"
          d="M2 33C18 31 26 24 42 26s26 7 44-4 34-14 72-12"
          stroke="#a3ce0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function TasksCompletedCard() {
  return (
    <div className={`w-44 p-3.5 text-left ${cardSurface}`}>
      <p className={labelClass}>Tasks Completed</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-lg font-bold tracking-tight text-gray-900 font-tabular dark:text-gray-50">
              18
            </p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#84cc16]">
              <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
              24%
            </span>
          </div>
          <p className={labelClass}>vs last week</p>
        </div>
        <div className="flex h-9 items-end gap-[3px]" aria-hidden>
          {[26, 42, 34, 58, 70, 88].map((h, i) => (
            <div
              key={i}
              className={`hero-bar-pulse w-[5px] rounded-[2px] ${
                i >= 4 ? "bg-[#C5F80A]" : "bg-gray-200 dark:bg-white/10"
              }`}
              style={{ height: `${h}%`, animationDelay: `${1.8 + i * 0.35}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Connectors() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        width="1100"
        height="440"
        viewBox="0 0 1100 440"
        fill="none"
        aria-hidden
      >
        <path
          d="M550 25A500 195 0 0 0 550 415"
          stroke="#111827"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path
          d="M550 25A500 195 0 0 1 550 415"
          stroke="#111827"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}

export function HeroFloatingCards() {
  return (
    <>
      <Connectors />
      <FloatCard
        className="left-[2%] top-[2%] xl:left-[4%] xl:top-[4%]"
        duration="9s"
        delay="0s"
        floatY="-4px"
        rotate="0.5deg"
        entranceDelay={0.9}
      >
        <NewLeadCard />
      </FloatCard>

      <FloatCard
        className="right-[2%] top-[26%] xl:right-[4%]"
        duration="11s"
        delay="-3.5s"
        floatY="-3px"
        rotate="-0.5deg"
        entranceDelay={1.05}
      >
        <DealWonCard />
      </FloatCard>

      <FloatCard
        className="bottom-[4%] left-[1.5%] xl:bottom-[6%] xl:left-[3.5%]"
        duration="10s"
        delay="-5s"
        floatY="-5px"
        rotate="0.4deg"
        entranceDelay={1.2}
      >
        <PipelineValueCard />
      </FloatCard>

      <FloatCard
        className="bottom-[6%] right-[2%] xl:right-[3.5%]"
        duration="8.5s"
        delay="-2s"
        floatY="-4px"
        rotate="-0.4deg"
        entranceDelay={1.35}
      >
        <TasksCompletedCard />
      </FloatCard>
    </>
  );
}
