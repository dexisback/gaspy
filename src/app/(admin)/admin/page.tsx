"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { QAManager } from "@/components/admin/QAManager";
import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { DocumentList } from "@/components/admin/DocumentList";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", label: "Dashboard" },
    { icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", label: "Documents" },
    { icon: "M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z", label: "Q&A" },
    { icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z", label: "Analytics" },
    { icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", label: "Users" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 180 : 60 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative z-30 flex flex-col border-r border-gray-100 bg-white"
    >
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 items-center justify-center border-b border-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        {navItems.map((item, i) => (
          <button
            key={i}
            className="flex h-10 items-center gap-3 rounded-lg px-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <svg
              className="shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={item.icon} />
            </svg>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}

function MockChart() {
  const data = [30, 45, 35, 55, 40, 60, 50, 70, 55, 80, 65, 90];
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ");

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Questions Over Time</h3>
        <span className="text-xs text-gray-400">Last 12 hours</span>
      </div>
      <div className="relative aspect-[2.5/1] w-full">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#f0f0f0"
              strokeWidth="0.5"
            />
          ))}
          {/* Area */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="rgba(197, 248, 10, 0.12)"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#C5F80A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {data.map((v, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 100}
              cy={100 - (v / max) * 80}
              r="1.2"
              fill="#171916"
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-end gap-2 border-b border-gray-100 px-6">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </header>

        {/* Bento Grid */}
        <div className="flex flex-1 gap-4 overflow-auto p-6">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Top: Chart */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <MockChart />
            </div>

            {/* Bottom: Analytics */}
            <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Top Questions</h3>
              <div className="flex-1 overflow-auto">
                <AnalyticsPanel />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Top: Q&A */}
            <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Q&A Pairs</h3>
              <div className="flex-1 overflow-auto">
                <QAManager />
              </div>
            </div>

            {/* Bottom: Upload */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Documents</h3>
              <DocumentUploader onUploaded={() => setRefreshKey((k) => k + 1)} />
              <div className="mt-3 max-h-[140px] overflow-auto">
                <DocumentList key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
