"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GaugeIcon } from "@/components/ui/gauge";
import { FileTextIcon } from "@/components/ui/file-text";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { ChartColumnIncreasingIcon } from "@/components/ui/chart-column-increasing";
import { SettingsIcon } from "@/components/ui/settings";
import { AccountMenu, type AdminUser } from "./AccountMenu";

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

export function AdminSidebar({ user }: { user: AdminUser }) {
  const isActive = useActive();

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-56 shrink-0 flex-col border-r border-border/50 bg-card/40 md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/50 px-4">
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
                className={`shrink-0 ${active ? "text-[#5d7a02] dark:text-[#C5F80A]" : "opacity-60"}`}
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
        <Link
          href="/admin/settings"
          className={`flex h-[38px] w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${
            isActive("/admin/settings")
              ? "bg-accent/15 text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <SettingsIcon size={15} className="opacity-60" />
          Settings
        </Link>

        <AccountMenu user={user} variant="block" />
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
      {[...navItems, { href: "/admin/settings", label: "Settings" }].map((item) => {
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
