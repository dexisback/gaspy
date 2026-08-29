"use client";

import { motion } from "framer-motion";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";
import { SettingsIcon } from "@/components/ui/settings";
import { SearchIcon } from "@/components/ui/search";
import { useTheme } from "./ThemeProvider";
import { useSearch } from "@/components/ui/SearchProvider";
import type { AdminUser } from "./Sidebar";

export function TopBar({ user }: { user: AdminUser }) {
  const { theme, toggleTheme } = useTheme();
  const { toggleSearch } = useSearch();

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-40 flex h-16 items-center justify-end gap-1 border-b border-border/50 bg-background/85 px-6 backdrop-blur-md"
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={toggleSearch}
        className="mr-auto flex h-9 items-center gap-2 rounded-lg border border-border/50 bg-card px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground cursor-pointer"
        title="Search (Ctrl+K)"
      >
        <SearchIcon size={13} className="opacity-60" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 font-mono text-[9.5px] text-muted-foreground/70">
          ⌘K
        </kbd>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={toggleTheme}
        className="mx-1 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer"
        title="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "dark" ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === "dark" ? (
            <MoonIcon size={16} className="opacity-80" />
          ) : (
            <SunIcon size={16} className="opacity-80" />
          )}
        </motion.div>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.94 }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer"
        title="Settings"
      >
        <SettingsIcon size={16} className="opacity-80" />
      </motion.button>

      <span className="mx-2 h-5 w-px bg-border/60" aria-hidden />

      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-[#5d7a02] dark:text-[#C5F80A]"
        title={`${user.name} · ${user.email}`}
      >
        {(user.name?.[0] ?? user.email?.[0] ?? "A").toUpperCase()}
      </div>
    </motion.header>
  );
}
