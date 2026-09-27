"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { couple } from "@/content/wedding";
import { useOverDark } from "@/lib/useOverDark";
import { usePageTransition } from "./PageTransition";
import NightSky from "./motion/NightSky";
import RevealText, { EXPO } from "./motion/RevealText";
import Snowdrift from "./Snowdrift";

/** Floating pill nav for the sub-pages: monogram + a way back home. */
export function SubNav() {
  const go = usePageTransition();
  const dark = useOverDark();
  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: EXPO }}
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border px-5 py-2.5 backdrop-blur-md transition-all duration-700 ${
          dark
            ? "border-white/10 bg-night/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            : "border-black/5 bg-ivory-2/90 shadow-[0_10px_40px_rgba(11,20,32,0.12)]"
        }`}
      >
        <button
          onClick={() => go("/")}
          className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-700 ${
            dark ? "text-gold-light" : "text-ink"
          }`}
        >
          {couple.monogram}
        </button>
        <button
          onClick={() => go("/")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-500 ${
            dark ? "bg-gold-light text-night hover:bg-white" : "bg-night text-ivory hover:bg-gold hover:text-night"
          }`}
        >
          ← Back to the wedding
        </button>
      </nav>
    </motion.header>
  );
}

/** Night-sky title band that melts into the ivory page below it. */
export function SubHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section data-nav-dark className="relative overflow-hidden bg-night px-6 pb-32 pt-40 text-center text-ivory md:pb-40 md:pt-48">
      <NightSky stars={80} />
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.p
          className="text-[0.68rem] uppercase tracking-[0.5em] text-gold-light sm:text-xs"
          initial={{ opacity: 0, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.6, delay: 0.25, ease: EXPO }}
        >
          {eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          text={title}
          trigger="mount"
          delay={0.35}
          className="display mt-5 text-6xl text-ivory sm:text-7xl md:text-8xl"
        />
        {intro && (
          <motion.p
            className="mx-auto mt-6 max-w-xl text-ivory/70"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.9, ease: EXPO }}
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.1, ease: EXPO }}
          >
            {children}
          </motion.div>
        )}
      </div>
      <Snowdrift />
    </section>
  );
}
