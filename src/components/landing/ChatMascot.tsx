"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

type Expression = "sad" | "confused" | "happy";

export function ChatMascotFace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expression, setExpression] = useState<Expression>("sad");
  const [isHovered, setIsHovered] = useState(false);

  const pupilX = useSpring(0, { stiffness: 250, damping: 20 });
  const pupilY = useSpring(0, { stiffness: 250, damping: 20 });

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

  const activeExpr: Expression =
    isHovered || expression === "happy" ? "happy" : expression;

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
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
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

      <svg
        width="88"
        height="88"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke="#171916"
          strokeWidth="1.5"
        />

        <motion.path
          d={leftEyebrowD}
          stroke="#171916"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        />

        <motion.path
          d={rightEyebrowD}
          stroke="#171916"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        />

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
  );
}
