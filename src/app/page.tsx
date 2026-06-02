"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { GradientArc } from "@/components/landing/GradientArc";
import { ChatMascot } from "@/components/landing/ChatMascot";

export default function Home() {
  const [phoneHover, setPhoneHover] = useState(false);

  return (
    <main className="relative flex h-screen flex-col bg-white">
      <Navbar shrink={phoneHover} />

      <div className="relative flex flex-1 flex-col items-center pt-8 md:pt-10">
        <Hero />

        <div className="relative mt-4 flex w-full flex-1 justify-center md:mt-6">
          <GradientArc />
        </div>
      </div>

      <div
        onMouseEnter={() => setPhoneHover(true)}
        onMouseLeave={() => setPhoneHover(false)}
        className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2"
        style={{ height: "480px", width: "360px" }}
      >
        <PhoneMockup />
      </div>

      <ChatMascot />
    </main>
  );
}
