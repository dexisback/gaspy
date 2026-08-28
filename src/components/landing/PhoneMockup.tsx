"use client";

import { motion } from "framer-motion";
import { ArrowUp, Bell, Handshake, Users } from "lucide-react";

function DashboardMockup() {
  return (
    <div className="flex h-full flex-col rounded-[36px] bg-gray-50 p-4 pt-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-900">Dashboard</h3>
        <div className="relative flex h-5 w-5 items-center justify-center">
          <Bell className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
          <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#C5F80A]" />
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="mb-2.5 rounded-2xl border border-black/[0.04] bg-white p-3 shadow-sm">
        <p className="text-[9px] font-medium text-gray-400">Pipeline Overview</p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <p className="text-lg font-bold tracking-tight text-gray-900">
            $124.8K
          </p>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#84cc16]">
            <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} />
            12.4%
          </span>
        </div>
        <p className="text-[8px] text-gray-400">vs last month</p>
        <svg
          viewBox="0 0 160 32"
          fill="none"
          className="mt-1.5 h-7 w-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          <path
            d="M2 26C16 24 24 18 38 20s26 6 42-3 32-11 78-9V32H2Z"
            fill="#C5F80A"
            opacity="0.1"
          />
          <path
            d="M2 26C16 24 24 18 38 20s26 6 42-3 32-11 78-9"
            stroke="#C5F80A"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Leads / Deals */}
      <div className="mb-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-black/[0.04] bg-white p-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-gray-400">Leads</p>
            <Users className="h-3 w-3 text-gray-300" strokeWidth={2} />
          </div>
          <p className="mt-0.5 text-base font-bold text-gray-900">128</p>
        </div>
        <div className="rounded-2xl border border-black/[0.04] bg-white p-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-gray-400">Deals</p>
            <Handshake className="h-3 w-3 text-gray-300" strokeWidth={2} />
          </div>
          <p className="mt-0.5 text-base font-bold text-gray-900">42</p>
        </div>
      </div>

      {/* Weekly activity */}
      <div className="mb-2.5 rounded-2xl border border-black/[0.04] bg-white p-3 shadow-sm">
        <p className="mb-1.5 text-[9px] font-medium text-gray-400">
          Weekly Activity
        </p>
        <div className="flex h-12 items-end gap-[3px]">
          {[35, 55, 40, 70, 50, 85, 65].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${
                i === 5 ? "bg-[#C5F80A]" : "bg-[#C5F80A]/25"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="flex-1 space-y-1.5">
        <p className="text-[9px] font-medium text-gray-400">Recent</p>
        {[
          { initial: "A", title: "Acme Corp.", meta: "New lead added", accent: true },
          { initial: "N", title: "Northwind Traders", meta: "Deal won · $8,200", accent: false },
          { initial: "B", title: "Beacon Labs", meta: "Follow-up call · 2:00 PM", accent: false },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 rounded-xl border border-black/[0.04] bg-white p-2 shadow-sm"
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                item.accent
                  ? "bg-[#C5F80A]/20 text-[#7da504]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="text-[9px] font-bold">{item.initial}</span>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-900">
                {item.title}
              </p>
              <p className="text-[9px] text-gray-400">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhoneMockup({
  onHoverChange,
}: {
  onHoverChange?: (hovered: boolean) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-1/2 z-10 -translate-x-1/2"
      style={{ height: "440px" }}
    >
      <motion.div
        className="pointer-events-auto relative cursor-pointer"
        initial={{ y: 340 }}
        animate={{ y: 340 }}
        whileHover={{ y: 170 }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.6,
        }}
      >
        {/* Phone Frame */}
        <div
          className="relative flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[48px] border-[8px] border-gray-900 bg-white"
          style={{
            boxShadow: `
              0 0 0 1px rgba(0,0,0,0.08),
              0 4px 12px rgba(0,0,0,0.06),
              0 16px 40px rgba(0,0,0,0.1),
              0 0 60px rgba(197,248,10,0.06)
            `,
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 pt-2 text-xs font-medium text-gray-900">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <div className="h-2 w-5 rounded-sm bg-gray-900" />
            </div>
          </div>

          {/* Dashboard Screen Content */}
          <div className="mt-5 flex-1 overflow-hidden px-2 pb-2">
            <DashboardMockup />
          </div>
        </div>

        {/* Side Buttons (decorative) */}
        <div className="absolute -left-[10px] top-24 h-8 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -left-[10px] top-36 h-14 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -left-[10px] top-52 h-14 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -right-[10px] top-40 h-20 w-[2px] rounded-r bg-gray-800" />
      </motion.div>
    </div>
  );
}
