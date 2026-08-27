"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { GradientArc } from "@/components/landing/GradientArc";
import { ChatMascotFace } from "@/components/landing/ChatMascot";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function Home() {
  const [phoneHover, setPhoneHover] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-white dark:bg-[#0c0b0a]">
      <Navbar shrink={phoneHover} />

      <div className="relative flex flex-1 flex-col items-center pt-8 md:pt-10">
        <Hero />

        <div className="relative mt-4 flex w-full flex-1 justify-center md:mt-6">
          <GradientArc />
        </div>
      </div>

      <PhoneMockup onHoverChange={setPhoneHover} />

      {/* Mascot / Chat morphing at bottom-right */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen ? (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.25 }}
              transition={{
                type: "spring",
                stiffness: 550,
                damping: 34,
                mass: 0.55,
              }}
              style={{ originX: 1, originY: 1 }}
              className="absolute bottom-0 right-0"
            >
              <ChatPanel onClose={() => setChatOpen(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="mascot"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 550,
                damping: 34,
                mass: 0.55,
              }}
              className="absolute bottom-0 right-0"
            >
              <button
                onClick={() => setChatOpen(true)}
                className="cursor-pointer"
              >
                <ChatMascotFace />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
