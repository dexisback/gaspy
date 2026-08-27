"use client";

import { motion } from "framer-motion";
import { GaugeIcon } from "@/components/ui/gauge";
import { FileTextIcon } from "@/components/ui/file-text";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { UsersIcon } from "@/components/ui/users";
import { Tooltip } from "./Tooltip";

const navItems = [
  { icon: GaugeIcon, label: "Dashboard" },
  { icon: FileTextIcon, label: "Documents" },
  { icon: MessageSquareIcon, label: "Q&A" },
  { icon: ChartColumnIncreasingIcon, label: "Analytics" },
  { icon: UsersIcon, label: "Users" },
];

export function Sidebar() {
  return (
    <aside className="relative z-30 flex w-14 shrink-0 flex-col items-center py-6">
      {/* Logo dot */}
      <div className="mb-8">
        <div className="h-2.5 w-2.5 rounded-full bg-accent" />
      </div>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <Tooltip key={item.label} label={item.label}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <item.icon
                className="shrink-0 opacity-55"
                size={15}
              />
              {/* Active indicator */}
              <div className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-accent opacity-0 hover:opacity-100 transition-opacity" />
            </motion.button>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom avatar placeholder */}
      <div className="mt-auto">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
          N
        </div>
      </div>
    </aside>
  );
}
