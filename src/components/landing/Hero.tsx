"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
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
        className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-6xl lg:text-7xl"
        style={{ textWrap: "balance" }}
      >
        Effortless Call{" "}
        <span className="text-[#C5F80A] drop-shadow-[0_0_24px_rgba(197,248,10,0.35)]">
          Scheduling
        </span>
        <br />
        That Makes your Life{" "}
        <span className="text-[#C5F80A] drop-shadow-[0_0_24px_rgba(197,248,10,0.35)]">
          Easier
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-lg text-base leading-relaxed text-gray-500"
        style={{ textWrap: "pretty" }}
      >
        Schedule calls with a single click. Go from no calls to your calendar
        filled with calls with ease using Shape AI, your favourite scheduling
        software.
      </motion.p>

      {/* CTA */}
      <motion.div variants={itemVariants} className="mt-8">
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-lg bg-[#1F2937] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
        >
          Get Started
        </Link>
      </motion.div>
    </motion.section>
  );
}
