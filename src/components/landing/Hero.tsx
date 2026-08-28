"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { HeroFloatingCards } from "./HeroFloatingCards";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function PipelineHighlight() {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span
        aria-hidden
        className="absolute -inset-x-3 -inset-y-1.5 rounded-2xl border border-[#C5F80A]/25 bg-[#C5F80A]/[0.12] shadow-[0_0_0_1px_rgba(197,248,10,0.05),0_10px_32px_-8px_rgba(197,248,10,0.20),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-[#C5F80A]/20 dark:bg-[#C5F80A]/[0.10]"
      />
      <span className="relative text-[#84cc16] dark:text-[#a6d911]">pipeline</span>
      <span
        aria-hidden
        className="absolute right-[-3px] top-[16%] h-[68%] w-[2.5px] rounded-full bg-[#a3ce0b]/70"
      />
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative w-full">
      <HeroFloatingCards />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center px-4 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/80 py-1.5 pl-3.5 pr-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5F80A] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C5F80A]" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Sales CRM for modern teams
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-gray-50 sm:text-5xl xl:text-6xl"
          style={{ textWrap: "balance" }}
        >
          Your sales <PipelineHighlight />,
          <br className="hidden sm:block" /> without the busywork.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base"
          style={{ textWrap: "pretty" }}
        >
          Manage leads, deals, activities, and forecasts from one focused
          workspace.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/admin"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#1F2937] px-7 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_28px_-6px_rgba(31,41,55,0.35)] transition-all duration-200 hover:-translate-y-px hover:bg-gray-800 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_14px_34px_-6px_rgba(31,41,55,0.45)] active:translate-y-0 active:scale-[0.98] dark:bg-[#C5F80A] dark:text-gray-900 dark:hover:bg-[#d4ff2e]"
          >
            Get Started
            <ArrowRight
              className="h-4 w-4 text-[#C5F80A] transition-transform duration-200 group-hover:translate-x-0.5 dark:text-gray-900"
              strokeWidth={2.5}
            />
          </Link>

          <Link
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <PlayCircle
              className="h-[18px] w-[18px] text-gray-400 transition-colors duration-150 group-hover:text-[#84cc16]"
              strokeWidth={2}
            />
            See how it works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
