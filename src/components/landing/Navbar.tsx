"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/components/ui/SearchProvider";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#" },
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#C5F80A]" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Gaspy
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSearch}
            className="hidden items-center gap-2 rounded-lg border border-gray-200/80 bg-gray-50/60 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150 cursor-pointer sm:flex md:mr-2"
          >
            <Search size={13} className="opacity-80" />
            <span>Search...</span>
            <span className="pointer-events-none rounded border border-gray-200 bg-white px-1.5 font-mono text-[9px] text-gray-400">
              ⌘K
            </span>
          </button>

          <Link
            href="#"
            className="text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-lg bg-[#1F2937] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800 active:scale-[0.98]"
          >
            Signup
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
