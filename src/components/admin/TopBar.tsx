"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-end gap-3 border-b border-border bg-card/60 backdrop-blur-xl px-6 shrink-0">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "dark" ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </motion.div>
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.92 }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Settings"
      >
        <Settings className="h-4 w-4" />
      </motion.button>
    </header>
  );
}
