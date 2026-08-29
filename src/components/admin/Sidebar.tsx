"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "./ThemeProvider";
import { GaugeIcon } from "@/components/ui/gauge";
import { FileTextIcon } from "@/components/ui/file-text";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { SettingsIcon } from "@/components/ui/settings";
import {
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Tooltip } from "./Tooltip";

export interface AdminUser {
  name: string;
  email: string;
}

const navItems = [
  { href: "/admin", label: "Overview", icon: GaugeIcon },
  { href: "/admin/qa", label: "Q&A Pairs", icon: MessageSquareIcon },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: FileTextIcon },
  { href: "/admin/analytics", label: "Analytics", icon: ChartColumnIncreasingIcon },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function initials(name: string, email: string) {
  return (name?.[0] ?? email?.[0] ?? "A").toUpperCase();
}

function AccountBlock({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-border/40 bg-card/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/50 cursor-pointer"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-[#5d7a02] dark:text-[#C5F80A]">
          {initials(user.name, user.email)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-foreground">
            {user.name}
          </span>
          <span className="truncate text-[10.5px] text-muted-foreground">
            {user.email}
          </span>
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-50 overflow-hidden rounded-lg border border-border/60 bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <div className="border-b border-border/40 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Signed in
            </p>
          </div>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50 cursor-pointer"
          >
            <LogOut size={13} className="text-muted-foreground" />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function AdminSidebar({ user }: { user: AdminUser }) {
  const isActive = useActive();
  const { toggleTheme } = useTheme();

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-56 shrink-0 flex-col border-r border-border/50 bg-card/40 md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border/50 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(197,248,10,0.5)]" />
        <span className="text-[15px] font-bold tracking-tight text-foreground">
          Gaspy
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Admin sections">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex h-[42px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-accent/15 text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <item.icon
                size={15}
                className={`shrink-0 ${active ? "text-[#7da504] dark:text-[#C5F80A]" : "opacity-60"}`}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings + account */}
      <div className="flex flex-col gap-3 border-t border-border/50 px-3 py-4">
        <Tooltip label="Toggle theme">
          <button
            onClick={toggleTheme}
            className="flex h-[38px] w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer"
          >
            <SettingsIcon size={15} className="opacity-60" />
            Settings
          </button>
        </Tooltip>

        <AccountBlock user={user} />
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const isActive = useActive();

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto border-b border-border/50 px-4 pb-2 md:hidden"
      aria-label="Admin sections"
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              active
                ? "bg-accent/15 text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            {active && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
