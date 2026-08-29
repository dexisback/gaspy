"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/components/ui/SearchProvider";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Product", href: "/admin/login" },
  { label: "Pricing", href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { label: "Blog", href: "https://github.com/dexisback/gaspy/#readme" },
];

interface NavbarProps {
  shrink?: boolean;
}

export function Navbar({ shrink = false }: NavbarProps) {
  const { toggleSearch } = useSearch();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: shrink ? 6 : 0,
        scale: shrink ? 0.94 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="relative z-50"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-5">
        {/* Logo */}
        <Link href="/" className="col-start-1 flex items-center gap-2 justify-self-start">
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Gaspy
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="col-start-2 hidden items-center gap-8 justify-self-center md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("http") ? (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="col-start-3 flex items-center gap-3 justify-self-end">
          <button
            onClick={toggleSearch}
            className="hidden items-center gap-2 rounded-lg border border-gray-200/80 bg-gray-50/60 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150 cursor-pointer dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100 sm:flex md:mr-2"
          >
            <Search size={13} className="opacity-80" />
            <span>Search...</span>
            <span className="pointer-events-none rounded border border-gray-200 bg-white px-1.5 font-mono text-[9px] text-gray-400 dark:border-white/10 dark:bg-white/10 dark:text-gray-500">
              ⌘K
            </span>
          </button>

          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#1F2937] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800 active:scale-[0.98]"
          >
            Admin
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
