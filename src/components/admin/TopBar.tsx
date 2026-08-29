"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";
import { SettingsIcon } from "@/components/ui/settings";
import { SearchIcon } from "@/components/ui/search";
import { useTheme } from "./ThemeProvider";
import { useSearch } from "@/components/ui/SearchProvider";
import { AccountMenu, type AdminUser } from "./AccountMenu";

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

      <Link
        href="/admin/settings"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        title="Settings"
      >
        <SettingsIcon size={16} className="opacity-80" />
      </Link>

      <span className="mx-2 h-5 w-px bg-border/60" aria-hidden />

      <AccountMenu user={user} variant="avatar" />
    </motion.header>
  );
}
