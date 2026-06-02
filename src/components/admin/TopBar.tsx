"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute top-5 right-8 z-40">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.1 }}
        className="flex items-center gap-1 rounded-full border border-border/40 bg-card/80 px-1.5 py-1.5 backdrop-blur-md"
      >
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
      </motion.div>
    </div>
  );
}
