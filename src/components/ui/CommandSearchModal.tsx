"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { FileTextIcon } from "@/components/ui/file-text";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { GaugeIcon } from "@/components/ui/gauge";
import { SearchIcon } from "@/components/ui/search";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";
import { HomeIcon } from "@/components/ui/home";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { useTheme } from "../admin/ThemeProvider";
import { QAPair, Document } from "@/types";

interface CommandSearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type IconComponent = ComponentType<{ size?: number; className?: string }>;

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Documents" | "Q&A" | "Actions";
  icon: IconComponent;
  action: () => void;
}

export function CommandSearchModal({ open, setOpen }: CommandSearchModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (open) {
      setSearch("");
      fetch("/api/documents")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setDocuments(data);
        })
        .catch(() => {});

      fetch("/api/qa")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setQaPairs(data);
        })
        .catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  const staticItems: SearchItem[] = [
    {
      id: "home",
      title: "Go to Home",
      subtitle: "Return to landing page overview",
      category: "Navigation",
      icon: HomeIcon,
      action: () => {
        router.push("/");
        setOpen(false);
      },
    },
    {
      id: "chat",
      title: "Go to Chat Workspace",
      subtitle: "Talk to the document AI intelligence agent",
      category: "Navigation",
      icon: MessageSquareIcon,
      action: () => {
        router.push("/chat");
        setOpen(false);
      },
    },
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      subtitle: "View core overview metrics and charts",
      category: "Navigation",
      icon: GaugeIcon,
      action: () => {
        router.push("/admin");
        setOpen(false);
      },
    },
  ];

  const dynamicDocItems: SearchItem[] = documents.map((doc) => ({
    id: `doc-${doc.id}`,
    title: doc.name,
    subtitle: `Size: ${(doc.size / 1024).toFixed(1)} KB · Type: ${doc.type}`,
    category: "Documents",
    icon: FileTextIcon,
    action: () => {
      router.push("/admin");
      setOpen(false);
    },
  }));

  const dynamicQaItems: SearchItem[] = qaPairs.map((qa) => ({
    id: `qa-${qa.id}`,
    title: qa.question,
    subtitle: `Answer: ${qa.answer}`,
    category: "Q&A",
    icon: MessageSquareIcon,
    action: () => {
      router.push("/admin");
      setOpen(false);
    },
  }));

  const actionItems: SearchItem[] = [
    {
      id: "toggle-theme",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      subtitle: "Toggle light / dark appearance across the app",
      category: "Actions",
      icon: theme === "dark" ? SunIcon : MoonIcon,
      action: () => {
        toggleTheme();
        // Keep the modal open so the theme change is visible immediately.
      },
    },
  ];

  const allItems = [...staticItems, ...dynamicDocItems, ...dynamicQaItems, ...actionItems];

  const fuse = new Fuse(allItems, {
    keys: ["title", "subtitle", "category"],
    threshold: 0.4,
  });

  const results = search ? fuse.search(search).map((r) => r.item) : allItems;

  const categories: Record<string, SearchItem[]> = {};
  results.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  return (
    <AnimatePresence>
      {open && (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-[#0c0b0a]/40 backdrop-blur-[3px] dark:bg-[#000000]/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-md md:inset-x-0 font-sans"
          >
            <Command shouldFilter={false} label="Command Menu" className="flex flex-col">
              <div className="flex items-center border-b border-border/80 px-4 py-3.5">
                <SearchIcon className="mr-3 shrink-0 text-muted-foreground/60" size={16} />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search pages, documents, Q&As..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-0 border-none"
                />
                <span className="text-[9px] font-medium text-muted-foreground/60 border border-border rounded px-1.5 py-0.5 tracking-wider uppercase font-mono shrink-0">
                  ESC
                </span>
              </div>

              <Command.List className="max-h-[340px] overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No matches found.
                </Command.Empty>

                {Object.entries(categories).map(([category, catItems]) => (
                  <Command.Group key={category} className="overflow-hidden">
                    <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
                      {category}
                    </div>
                    {catItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.id}
                          value={item.title}
                          onSelect={item.action}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground group outline-none"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-data-[selected=true]:bg-accent-foreground/10 group-data-[selected=true]:text-accent-foreground">
                            <Icon size={14} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium truncate text-foreground group-data-[selected=true]:text-accent-foreground">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-xs text-muted-foreground/70 truncate group-data-[selected=true]:text-accent-foreground/80">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                          <ChevronRightIcon
                            size={12}
                            className="text-muted-foreground/40 group-data-[selected=true]:text-accent-foreground/60 transition-transform group-data-[selected=true]:translate-x-0.5"
                          />
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
