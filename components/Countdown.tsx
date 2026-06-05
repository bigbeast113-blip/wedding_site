"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { countdown, couple } from "@/content/wedding";

function diff(target: number) {
  const now = Date.now();
  const delta = Math.max(0, target - now);
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const PAD = (n: number) => n.toString().padStart(2, "0");

export default function Countdown() {
  const target = new Date(couple.date).getTime();
  // Start null to avoid hydration mismatch; fill in on the client.
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "days", value: t ? t.days : 0 },
    { label: "hours", value: t ? PAD(t.hours) : "00" },
    { label: "minutes", value: t ? PAD(t.minutes) : "00" },
    { label: "seconds", value: t ? PAD(t.seconds) : "00" },
  ];

  return (
    <section className="section-frost relative px-6 py-24 text-center">
      <motion.div
        className="mx-auto flex max-w-3xl items-end justify-center gap-3 sm:gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        {units.map((u, i) => (
          <div key={u.label} className="flex items-end gap-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="display text-5xl text-ink sm:text-7xl md:text-8xl">
                {u.value}
              </span>
              <span className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-stone sm:text-xs">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="display pb-6 text-4xl text-stone/40 sm:text-6xl">:</span>
            )}
          </div>
        ))}
      </motion.div>

      <motion.a
        href={countdown.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto mt-16 block max-w-4xl overflow-hidden rounded-xl shadow-xl"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
      >
        <img
          src={countdown.illustration}
          alt={couple.venue}
          className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
        />
        {/* booking cue */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-6 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-ink shadow-lg">
            {countdown.bookingCta} →
          </span>
        </div>
      </motion.a>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone">
        click the lodge to book your room
      </p>
    </section>
  );
}
