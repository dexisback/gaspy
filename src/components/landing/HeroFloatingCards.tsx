"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Dispatch, CSSProperties, ReactNode, SetStateAction } from "react";
import { ArrowUp, Plus, User } from "lucide-react";

type CardId = "lead" | "pipeline" | "deal" | "tasks";

const DESCRIPTIONS: Record<CardId, string> = {
  lead: "New leads captured and added to your CRM.",
  pipeline: "Total value of deals currently in your pipeline.",
  deal: "Revenue generated from recently closed deals.",
  tasks: "Tasks completed by your sales team this week.",
};

function TicketCard({
  id,
  className,
  duration,
  delay,
  floatY,
  entranceDelay,
  baseRotate,
  focused,
  setFocused,
  children,
}: {
  id: CardId;
  className: string;
  duration: string;
  delay: string;
  floatY: string;
  entranceDelay: number;
  baseRotate: number;
  focused: CardId | null;
  setFocused: Dispatch<SetStateAction<CardId | null>>;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const isFocused = focused === id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: entranceDelay }}
      className={`hero-card pointer-events-auto absolute hidden lg:block ${
        isFocused ? "z-50" : "z-0"
      } ${className}`}
      tabIndex={0}
      role="group"
      aria-label={DESCRIPTIONS[id]}
      onMouseEnter={() => setFocused(id)}
      onMouseLeave={() => setFocused((f) => (f === id ? null : f))}
      onFocus={() => setFocused(id)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setFocused((f) => (f === id ? null : f));
      }}
      onClick={() => setFocused(id)}
    >
      <div
        className={`hero-float ${isFocused ? "hero-float-paused" : ""}`}
        style={
          {
            "--float-duration": duration,
            "--float-delay": delay,
            "--float-y": floatY,
            "--float-rotate": "0.3deg",
          } as CSSProperties
        }
      >
        <motion.div
          animate={
            isFocused && !reduced
              ? { scale: 1.05, y: -6, rotate: 0 }
              : {
                  scale: 1,
                  y: 0,
                  rotate: reduced ? 0 : baseRotate,
                }
          }
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.3, 1] }}
          className={isFocused ? "hero-focus" : undefined}
        >
          <div className="ticket-shadow">
            <div className="ticket relative">
              <div
                aria-hidden
                className="paper-grain pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-60"
              />
              {children}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isFocused && (
            <motion.p
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              transition={{
                duration: reduced ? 0 : 0.2,
                delay: reduced ? 0 : 0.15,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-[calc(100%+10px)] z-50 w-max max-w-[240px] rounded-lg border border-black/[0.06] bg-white/95 px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-gray-500 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#1c1a18]/95 dark:text-gray-400"
            >
              {DESCRIPTIONS[id]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function NewLeadCard({ isFocused }: { isFocused: boolean }) {
  return (
    <div className="w-44 p-3.5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C5F80A]/20">
            <User
              className={`h-2.5 w-2.5 text-[#7da504] dark:text-[#a6d911] ${
                isFocused ? "ticket-pulse" : ""
              }`}
              strokeWidth={2.5}
            />
          </span>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
            New Lead
          </span>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-black/[0.06] bg-white text-gray-400 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Plus className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        Acme Corp.
      </p>
      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
        Software · 50+ employees
      </p>
    </div>
  );
}

function DealWonCard({ isFocused }: { isFocused: boolean }) {
  return (
    <div className="w-44 p-3.5 text-left">
      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
        Deal Won
      </p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-bold tracking-tight text-gray-900 font-tabular dark:text-gray-50">
          $24,800
        </p>
        <svg
          viewBox="0 0 64 24"
          fill="none"
          className="h-6 w-16 shrink-0"
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
            opacity={isFocused ? 0.25 : 0.9}
          />
          {isFocused && (
            <path
              key="deal-draw"
              className="ticket-draw"
              d="M2 18L12 15L22 16.5L32 10L42 12L52 5L62 6"
              pathLength={1}
              stroke="#a3ce0b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

function PipelineValueCard({ isFocused }: { isFocused: boolean }) {
  return (
    <div className="w-48 p-3.5 text-left">
      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
        Pipeline Value
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-lg font-bold tracking-tight text-gray-900 font-tabular dark:text-gray-50">
          $124.8K
        </p>
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#84cc16]">
          <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
          12.4%
        </span>
      </div>
      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
        vs last month
      </p>
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
          className={isFocused ? "ticket-draw-area" : undefined}
          opacity={isFocused ? undefined : 0.1}
        />
        <path
          d="M2 33C18 31 26 24 42 26s26 7 44-4 34-14 72-12"
          stroke="#C5F80A"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={isFocused ? 0.25 : 1}
        />
        {isFocused && (
          <path
            key="pipeline-draw"
            className="ticket-draw"
            d="M2 33C18 31 26 24 42 26s26 7 44-4 34-14 72-12"
            pathLength={1}
            stroke="#a3ce0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}

function TasksCompletedCard({ isFocused }: { isFocused: boolean }) {
  return (
    <div className="w-44 p-3.5 text-left">
      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
        Tasks Completed
      </p>
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
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
            vs last week
          </p>
        </div>
        <div className="flex h-9 items-end gap-[3px]" aria-hidden>
          {[26, 42, 34, 58, 70, 88].map((h, i) => (
            <div
              key={i}
              className={`w-[5px] rounded-[2px] ${
                i >= 4 ? "bg-[#C5F80A]" : "bg-gray-200 dark:bg-white/10"
              } ${isFocused ? "ticket-bars" : ""}`}
              style={{
                height: `${h}%`,
                animationDelay: isFocused ? `${0.35 + i * 0.07}s` : undefined,
              }}
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
  const [focused, setFocused] = useState<CardId | null>(null);
  const reduced = useReducedMotion();

  // Touch: tapping anywhere outside the tickets clears focus.
  useEffect(() => {
    if (!focused) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.(".hero-card")) setFocused(null);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [focused]);

  return (
    <>
      <AnimatePresence>
        {focused && (
          <motion.div
            key="focus-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            aria-hidden
            className="focus-dim pointer-events-none fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>

      <Connectors />

      <TicketCard
        id="lead"
        className="left-[2%] top-[2%] xl:left-[4%] xl:top-[4%]"
        duration="9s"
        delay="0s"
        floatY="-4px"
        entranceDelay={0.9}
        baseRotate={-1}
        focused={focused}
        setFocused={setFocused}
      >
        <NewLeadCard isFocused={focused === "lead"} />
      </TicketCard>

      <TicketCard
        id="deal"
        className="right-[2%] top-[26%] xl:right-[4%]"
        duration="11s"
        delay="-3.5s"
        floatY="-3px"
        entranceDelay={1.05}
        baseRotate={1}
        focused={focused}
        setFocused={setFocused}
      >
        <DealWonCard isFocused={focused === "deal"} />
      </TicketCard>

      <TicketCard
        id="pipeline"
        className="bottom-[4%] left-[1.5%] xl:bottom-[6%] xl:left-[3.5%]"
        duration="10s"
        delay="-5s"
        floatY="-5px"
        entranceDelay={1.2}
        baseRotate={-1.5}
        focused={focused}
        setFocused={setFocused}
      >
        <PipelineValueCard isFocused={focused === "pipeline"} />
      </TicketCard>

      <TicketCard
        id="tasks"
        className="bottom-[6%] right-[2%] xl:right-[3.5%]"
        duration="8.5s"
        delay="-2s"
        floatY="-4px"
        entranceDelay={1.35}
        baseRotate={1.5}
        focused={focused}
        setFocused={setFocused}
      >
        <TasksCompletedCard isFocused={focused === "tasks"} />
      </TicketCard>
    </>
  );
}
