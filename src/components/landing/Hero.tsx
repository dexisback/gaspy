"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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

/**
 * Hand-drawn marker stroke. The path is slightly oblique and organically
 * imperfect; it draws itself left → right via stroke-dashoffset once.
 */
function MarkerStroke({
  d,
  viewBox,
  className,
  delay,
  duration,
  strokeWidth,
  opacity,
}: {
  d: string;
  viewBox: string;
  className: string;
  delay: number;
  duration: number;
  strokeWidth: number;
  opacity: number;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d={d}
        pathLength={1}
        stroke="#C5F80A"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        vectorEffect="non-scaling-stroke"
        className="hero-marker"
        style={
          {
            "--draw-delay": `${delay}s`,
            "--draw-dur": `${duration}s`,
          } as CSSProperties
        }
      />
    </svg>
  );
}

const MARKER_MAIN_D =
  "M8 17C48 14.6 92 15.4 138 13.6C186 11.8 232 11 268 9.6C288 8.8 304 8.2 313 7.4";
const MARKER_KEY_D = "M4 8.4C28 7 54 7.6 96 5.4";

function Keyword({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="relative inline-block">
      {children}
      <MarkerStroke
        d={MARKER_KEY_D}
        viewBox="0 0 100 12"
        className="-bottom-1 left-[-4%] h-2 w-[108%]"
        delay={delay}
        duration={0.45}
        strokeWidth={3.5}
        opacity={0.42}
      />
    </span>
  );
}

function PipelineHighlight() {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span
        aria-hidden
        className="absolute -inset-x-3 -inset-y-1.5 overflow-hidden rounded-2xl border border-[#C5F80A]/25 shadow-[0_0_0_1px_rgba(197,248,10,0.05),0_10px_32px_-8px_rgba(197,248,10,0.20),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-[#C5F80A]/20"
      >
        <span className="hero-reveal-fill absolute inset-0 bg-[#C5F80A]/[0.14] dark:bg-[#C5F80A]/[0.12]" />
        <span className="hero-reveal-edge absolute inset-y-0 left-0 w-[18%]" />
      </span>
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
        className="pointer-events-none relative z-10 flex flex-col items-center px-4 text-center"
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
          className="mt-6 max-w-3xl text-[1.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-gray-50 sm:text-5xl sm:[text-wrap:balance] xl:text-6xl"
        >
          Your sales <PipelineHighlight />
          <br className="hidden sm:block" />{" "}
          <span className="relative inline-block whitespace-nowrap">
            without the busywork.
            <MarkerStroke
              d={MARKER_MAIN_D}
              viewBox="0 0 320 24"
              className="-bottom-2.5 left-[2%] h-3 w-[96%]"
              delay={0.25}
              duration={1.05}
              strokeWidth={5}
              opacity={0.55}
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="relative mt-5 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base"
          style={{ textWrap: "pretty" }}
        >
          Manage <Keyword delay={1.4}>leads</Keyword>,{" "}
          <Keyword delay={1.5}>deals</Keyword>,{" "}
          <Keyword delay={1.6}>activities</Keyword>, and{" "}
          <Keyword delay={1.7}>forecasts</Keyword> from one{" "}
          <Keyword delay={1.8}>focused workspace</Keyword>.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/admin"
            className="group pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-[#1F2937] px-7 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_-6px_rgba(31,41,55,0.28)] transition-all duration-200 hover:-translate-y-px hover:bg-[#2a3547] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_10px_22px_-6px_rgba(31,41,55,0.35)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.10)] dark:bg-[#23272f] dark:ring-white/10 dark:hover:bg-[#2b3038]"
          >
            Get Started
            <ArrowRight
              className="h-4 w-4 text-[#C5F80A] transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
            />
          </Link>

          <a
            href="https://github.com/dexisback/gaspy/#readme"
            className="group pointer-events-auto inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <PlayCircle
              className="h-[18px] w-[18px] text-gray-400 transition-colors duration-150 group-hover:text-[#84cc16]"
              strokeWidth={2}
            />
            See how it works
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
