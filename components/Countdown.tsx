"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { countdown, couple } from "@/content/wedding";
import NightSky from "./motion/NightSky";
import RevealText, { EXPO } from "./motion/RevealText";
import ParallaxImage from "./motion/ParallaxImage";
import { PhoneIcon } from "./Icons";
import Snowdrift from "./Snowdrift";

function diff(target: number) {
  const delta = Math.max(0, target - Date.now());
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
  };
}

/** One odometer wheel: a 0–9 strip that rolls to the current digit. */
function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: "1.08em", width: "0.62em" }}>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        animate={{ y: `${-value * 1.08}em` }}
        transition={{ type: "spring", stiffness: 90, damping: 17, mass: 0.9 }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex items-center justify-center" style={{ height: "1.08em", lineHeight: 1 }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Unit({ value, label, min = 2 }: { value: number; label: string; min?: number }) {
  const digits = String(value).padStart(min, "0").split("").map(Number);
  return (
    <div className="flex flex-col items-center">
      <div
        className="display flex text-[3.3rem] leading-none text-gold-light sm:text-7xl md:text-8xl lg:text-[8.5rem]"
        style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
      >
        {digits.map((d, i) => (
          <Digit key={`${digits.length}-${i}`} value={d} />
        ))}
      </div>
      <span className="mt-3 text-[0.56rem] uppercase tracking-[0.35em] text-ivory/55 sm:text-[0.66rem]">{label}</span>
    </div>
  );
}

const Sep = () => (
  <span className="display self-start pt-[0.1em] text-[2.4rem] leading-none text-gold/40 sm:text-6xl md:text-7xl lg:text-8xl">
    :
  </span>
);

export default function Countdown() {
  const target = new Date(couple.date).getTime();
  const clockRef = useRef<HTMLDivElement>(null);
  const inView = useInView(clockRef, { once: true, amount: 0.6 });
  // Start at zeros; the wheels roll up to the real time when you arrive.
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!inView) return;
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [inView, target]);

  return (
    <section id="countdown" data-nav-dark className="relative overflow-hidden bg-night px-5 py-28 text-center text-ivory md:py-40">
      <NightSky stars={85} />
      <Snowdrift edge="top" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="text-[0.68rem] uppercase tracking-[0.5em] text-gold-light sm:text-xs">{countdown.eyebrow}</p>
        <RevealText as="h2" text={countdown.heading} className="display mt-5 text-5xl italic text-ivory md:text-7xl" />

        <div ref={clockRef} className="mt-14 flex items-start justify-center gap-2.5 sm:gap-6 md:mt-20 md:gap-9">
          <Unit value={t.days} label="days" />
          <Sep />
          <Unit value={t.hours} label="hours" />
          <Sep />
          <Unit value={t.minutes} label="minutes" />
          <Sep />
          <Unit value={t.seconds} label="seconds" />
        </div>

        {/* the venue */}
        <motion.a
          href={countdown.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${countdown.bookingCta} (opens in a new tab)`}
          className="group relative mx-auto mt-20 block max-w-5xl overflow-hidden rounded-2xl ring-1 ring-white/10 md:mt-28"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.2, ease: EXPO }}
        >
          <ParallaxImage src={countdown.illustration} alt={couple.venue} className="aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[21/9]" speed={0.08} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 text-left sm:flex-row sm:items-end sm:justify-between md:p-10">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.42em] text-gold-light">the venue</p>
              <p className="display mt-2 text-4xl text-white md:text-6xl">{couple.venue}</p>
              <p className="mt-1 text-sm text-white/70">{couple.city}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-500 group-hover:border-gold-light group-hover:bg-gold-light group-hover:text-night">
              {countdown.bookingCta}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </motion.a>

        <motion.div
          className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-xl border border-gold/30 bg-white/[0.04] px-5 py-4 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.1, ease: EXPO }}
        >
          <PhoneIcon className="mt-0.5 h-5 w-5 flex-none text-gold-light" />
          <p className="text-sm leading-relaxed text-ivory/85">{countdown.note}</p>
        </motion.div>
      </div>
      <Snowdrift flip />
    </section>
  );
}
