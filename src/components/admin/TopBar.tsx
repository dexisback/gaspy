"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Settings, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useSearch } from "@/components/ui/SearchProvider";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSearch } = useSearch();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.1 }}
      className="z-40 flex items-center justify-end px-6 py-5"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-border/40 bg-card/80 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={toggleSearch}
          className="flex h-8 items-center gap-2 rounded-full border border-border/30 bg-muted/40 px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer"
          title="Search (Ctrl+K)"
        >
          <Search size={12} className="opacity-70" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="pointer-events-none rounded bg-card/80 px-1.5 font-mono text-[9px] text-muted-foreground/60 border border-border/30">
            ⌘K
          </kbd>
        </motion.button>
        <span className="mx-0.5 h-5 w-px bg-border/50" />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer"
          title="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === "dark" ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {theme === "dark" ? (
              <Moon size={16} strokeWidth={1.5} className="opacity-80" />
            ) : (
              <Sun size={16} strokeWidth={1.5} className="opacity-80" />
            )}
          </motion.div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer"
          title="Settings"
        >
          <Settings size={16} strokeWidth={1.5} className="opacity-80" />
        </motion.button>
      </div>
    </motion.header>
  );
}
