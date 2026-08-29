"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export interface AdminUser {
  name: string;
  email: string;
}

function initials(user: AdminUser) {
  return (user.name?.[0] ?? user.email?.[0] ?? "A").toUpperCase();
}

/**
 * Shared account control. `variant="block"` renders the sidebar account
 * block (name + email + chevron); `variant="avatar"` renders the compact
 * topbar avatar. Both open the same working dropdown with Sign out.
 */
export function AccountMenu({
  user,
  variant,
}: {
  user: AdminUser;
  variant: "block" | "avatar";
}) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
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
      // Hard navigation guarantees all client state (router cache included)
      // is dropped along with the session.
      window.location.assign("/admin/login");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      {variant === "block" ? (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-lg border border-border/40 bg-card/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/50 cursor-pointer"
          aria-expanded={open}
          aria-label="Account menu"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-[#5d7a02] dark:text-[#C5F80A]">
            {initials(user)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-[12px] font-semibold text-foreground">
              {user.name}
            </span>
            <span className="truncate text-[10.5px] text-muted-foreground">
              {user.email}
            </span>
          </span>
          <span
            className={`shrink-0 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-[#5d7a02] transition-transform hover:scale-105 active:scale-95 cursor-pointer dark:text-[#C5F80A]"
          aria-expanded={open}
          aria-label="Account menu"
        >
          {initials(user)}
        </button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-50 w-56 overflow-hidden rounded-lg border border-border/60 bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
            variant === "block"
              ? "bottom-[calc(100%+6px)] left-0 right-0"
              : "right-0 top-[calc(100%+8px)]"
          }`}
        >
          <div className="flex items-center gap-2.5 border-b border-border/40 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-[#5d7a02] dark:text-[#C5F80A]">
              {initials(user)}
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[12.5px] font-semibold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </span>
            </span>
          </div>
          <div className="p-1">
            <button
              onClick={signOut}
              disabled={signingOut}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={13} className="text-muted-foreground" />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

