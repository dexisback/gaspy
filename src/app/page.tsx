import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { GradientArc } from "@/components/landing/GradientArc";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      <Navbar />

      <div className="relative flex flex-1 flex-col items-center pt-16 md:pt-20">
        <Hero />

        <div className="relative mt-10 flex w-full flex-1 justify-center pb-0 md:mt-14">
          <GradientArc />
          <PhoneMockup />
        </div>
      </div>
    </main>
  );
}
