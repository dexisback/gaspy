"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";

type Expression = "sad" | "confused" | "happy";

export function ChatMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expression, setExpression] = useState<Expression>("sad");
  const [isHovered, setIsHovered] = useState(false);

  const pupilX = useSpring(0, { stiffness: 250, damping: 20 });
  const pupilY = useSpring(0, { stiffness: 250, damping: 20 });
  const scale = useSpring(1, { stiffness: 400, damping: 25 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxPupilOffset = 2;
      const angle = Math.atan2(dy, dx);
      const pupilDist = Math.min(distance / 60, maxPupilOffset);
      pupilX.set(Math.cos(angle) * pupilDist);
      pupilY.set(Math.sin(angle) * pupilDist);

      let next: Expression = "sad";
      if (distance < 160) {
        next = "happy";
      } else if (distance < 420) {
        next = "confused";
      }
      setExpression(next);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pupilX, pupilY]);

  useEffect(() => {
    scale.set(isHovered ? 1.1 : 1);
  }, [isHovered, scale]);

  const activeExpr: Expression =
    isHovered || expression === "happy" ? "happy" : expression;

  // Eyebrow paths with Y-position baked in — no transforms on SVG elements
  const leftEyebrowD =
    activeExpr === "sad"
      ? "M11 20.5Q16.5 23.5 22 20.5"
      : activeExpr === "confused"
        ? "M11 16L22 16"
        : "M11 12.5Q16.5 10 22 12";

  const rightEyebrowD =
    activeExpr === "sad"
      ? "M28 20.5Q33.5 23.5 39 20.5"
      : activeExpr === "confused"
        ? "M28 16L39 16"
        : "M28 12Q33.5 10 39 12.5";

  return (
    <Link href="/chat">
      <motion.div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        style={{ scale }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background disc with shadow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            width: "88px",
            height: "88px",
            background: "#F2F4F5",
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.08),
              0 8px 24px rgba(0,0,0,0.06),
              0 0 0 1px rgba(0,0,0,0.04),
              0 0 40px rgba(197,248,10,0.08)
            `,
          }}
        />

        {/* Face SVG */}
        <svg
          width="88"
          height="88"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          {/* Head outline */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="#171916"
            strokeWidth="1.5"
          />

          {/* Left Eyebrow */}
          <motion.path
            d={leftEyebrowD}
            stroke="#171916"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
          />

          {/* Right Eyebrow */}
          <motion.path
            d={rightEyebrowD}
            stroke="#171916"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
          />

          {/* Left Eye */}
          <g transform="translate(16.5, 23)">
            <ellipse cx="0" cy="0" rx="2.6" ry="2.1" fill="#171916" />
            <motion.ellipse
              cx="0"
              cy="0"
              rx="0.85"
              ry="0.85"
              fill="#F2F4F5"
              style={{ x: pupilX, y: pupilY }}
            />
          </g>

          {/* Right Eye */}
          <g transform="translate(33.5, 23)">
            <ellipse cx="0" cy="0" rx="2.6" ry="2.1" fill="#171916" />
            <motion.ellipse
              cx="0"
              cy="0"
              rx="0.85"
              ry="0.85"
              fill="#F2F4F5"
              style={{ x: pupilX, y: pupilY }}
            />
          </g>

          {/* Nose (L-shape) */}
          <path
            d="M25 27.5L22 34L28 33.5"
            stroke="#171916"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </Link>
  );
}
