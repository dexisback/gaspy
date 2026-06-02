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
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: FileText, label: "Documents" },
  { icon: MessageSquare, label: "Q&A" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Users" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 200 : 68 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative z-30 flex shrink-0 flex-col border-r border-border bg-card backdrop-blur-xl"
    >
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-16 items-center justify-center border-b border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Menu className="h-[18px] w-[18px]" />
        </motion.div>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col gap-1.5 px-2.5 py-4">
        {navItems.map((item, i) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-10 items-center gap-3 rounded-xl px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group"
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
                      delay: i * 0.03,
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                    },
                  }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-sm font-medium overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {/* Active indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}
