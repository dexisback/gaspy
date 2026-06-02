"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Menu,
  Sun,
  Settings,
  Plus,
} from "lucide-react";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { QAManager } from "@/components/admin/QAManager";
import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { DocumentList } from "@/components/admin/DocumentList";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: FileText, label: "Documents" },
  { icon: MessageSquare, label: "Q&A" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
];

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 180 : 60 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative z-30 flex flex-col border-r border-gray-100 bg-white shrink-0"
    >
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 items-center justify-center border-b border-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Menu className="h-[18px] w-[18px]" />
        </motion.div>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        <AnimatePresence>
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={false}
              animate={
                expanded
                  ? { opacity: 1, x: 0 }
                  : { opacity: 1, x: 0 }
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex h-10 items-center gap-3 rounded-lg px-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 relative group"
            >
              <item.icon className="shrink-0 h-[18px] w-[18px]" />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      transition: {
                        delay: i * 0.04,
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      },
                    }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap text-sm font-medium overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Active indicator */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#C5F80A] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </AnimatePresence>
      </nav>
    </motion.aside>
  );
}

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-end gap-2 border-b border-gray-100 px-6 shrink-0">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 active:scale-95">
            <Sun className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 active:scale-95">
            <Settings className="h-4 w-4" />
          </button>
        </header>

        {/* Bento Grid — locked to remaining viewport */}
        <div className="flex flex-1 gap-4 p-6 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            {/* Top: Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.05 }}
              whileHover={{ scale: 1.005 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md shrink-0"
              style={{ height: "42%" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Questions Over Time</h3>
                <span className="text-xs text-gray-400">Last 12 hours</span>
              </div>
              <div className="flex-1 min-h-0">
                <AnalyticsChart />
              </div>
            </motion.div>

            {/* Bottom: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
              whileHover={{ scale: 1.005 }}
              className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md min-h-0"
            >
              <h3 className="mb-3 text-sm font-semibold text-gray-900 shrink-0">Top Questions</h3>
              <div className="flex-1 overflow-y-auto min-h-0">
                <AnalyticsPanel />
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            {/* Top: Q&A */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.15 }}
              whileHover={{ scale: 1.005 }}
              className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md min-h-0"
            >
              <div className="mb-3 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">Q&A Pairs</h3>
                <button
                  onClick={() => {
                    // Dispatch a custom event that QAManager listens for
                    window.dispatchEvent(new CustomEvent("open-qa-add"));
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171916] text-white hover:bg-gray-800 transition-colors active:scale-95"
                  title="Add Q&A Pair"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                <QAManager />
              </div>
            </motion.div>

            {/* Bottom: Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
              whileHover={{ scale: 1.005 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md shrink-0"
            >
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Documents</h3>
              <DocumentUploader onUploaded={() => setRefreshKey((k) => k + 1)} />
              <div className="mt-3 overflow-y-auto max-h-[120px]">
                <DocumentList key={refreshKey} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
