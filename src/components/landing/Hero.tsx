"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export function Hero() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-gray-50 md:text-5xl lg:text-6xl"
        style={{ textWrap: "balance" }}
      >
        Manage Leads,{" "}
        <span className="text-[#C5F80A] drop-shadow-[0_0_20px_rgba(197,248,10,0.3)]">
          Deals, and Sales
        </span>
        <br />
        Teams from One Dashboard{" "}
        <span className="text-[#C5F80A] drop-shadow-[0_0_20px_rgba(197,248,10,0.3)]">
          Easier
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        variants={itemVariants}
        className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base"
        style={{ textWrap: "pretty" }}
      >
       Stop juggling spreadsheets. Manage prospects, deals, activities, and forecasts from a single CRM platform.
      </motion.p>

      {/* CTA */}
      <motion.div variants={itemVariants} className="mt-6">
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-lg bg-[#1F2937] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
        >
          Get Started
        </Link>
      </motion.div>
    </motion.section>
  );
}
