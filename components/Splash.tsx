"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { splash, couple } from "@/content/wedding";

// The enter animation: a long push straight through the portal opening.
const ZOOM = { duration: 2.4, ease: [0.5, 0, 0.85, 0.4] as const };
const REST = { duration: 1.2, ease: "easeOut" as const };

export default function Splash({ onEnter }: { onEnter: () => void }) {
  const [entering, setEntering] = useState(false);

  // Gentle mouse parallax (disabled once we start diving in).
  const mx = useSpring(0, { stiffness: 55, damping: 16, mass: 0.5 });
  const my = useSpring(0, { stiffness: 55, damping: 16, mass: 0.5 });
  // Parallax depth: the far scene barely moves, couple a little, near snow most.
  const bgX = useTransform(mx, (v) => v * 3);
  const bgY = useTransform(my, (v) => v * 2);
  const coX = useTransform(mx, (v) => v * 8);
  const coY = useTransform(my, (v) => v * 5);
  const fgX = useTransform(mx, (v) => v * 15);
  const fgY = useTransform(my, (v) => v * 10);

  const flakes = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 4) * 1.5;
        const dur = 8 + (i % 6) * 2;
        const delay = -((i * 1.9) % dur);
        const drift = (i % 2 ? 1 : -1) * (10 + (i % 4) * 8);
        return { left, size, dur, delay, drift, op: 0.4 + (i % 4) * 0.14 };
      }),
    []
  );

  function handleMouse(e: React.MouseEvent) {
    if (entering) return;
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  }

  function enter() {
    if (entering) return;
    setEntering(true);
    mx.set(0);
    my.set(0);
    window.setTimeout(onEnter, 1150);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-[#0b1420]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* 1 — the winter portal. Scaling into the centre = flying through the
             opening (the archway sits at the frame edges, valley in the middle). */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY }}>
        <motion.img
          src={splash.vista}
          alt=""
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover sm:block"
          animate={entering ? { scale: 2.2 } : { scale: 1.05 }}
          transition={entering ? ZOOM : REST}
        />
        <motion.img
          src={splash.vistaTall}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover sm:hidden"
          animate={entering ? { scale: 2.2 } : { scale: 1.05 }}
          transition={entering ? ZOOM : REST}
        />
      </motion.div>

      {/* 2 — the two of you, small, standing on the path in the opening */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ x: coX, y: coY }}
      >
        <motion.img
          src={splash.couple}
          alt={couple.names}
          className="w-auto object-contain"
          style={{
            maxHeight: "25vh",
            marginTop: "15vh",
            filter: "brightness(1) drop-shadow(0 12px 22px rgba(8,16,26,0.6))",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={entering ? { opacity: 0, scale: 3.5, y: -60 } : { opacity: 1, scale: 1, y: 0 }}
          transition={entering ? ZOOM : { opacity: { duration: 1.6 }, default: REST }}
        />
      </motion.div>

      {/* 3 — FRONT archway (center cut out): frames the couple, and rushes past
             the camera on the dive-through. Different image from the vista, so
             it stays razor-sharp with no ghosting. */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: fgX, y: fgY }}>
        <motion.img
          src={splash.frame}
          alt=""
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover sm:block"
          animate={entering ? { scale: 4, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? ZOOM : REST}
        />
        <motion.img
          src={splash.frameTall}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover sm:hidden"
          animate={entering ? { scale: 4, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? ZOOM : REST}
        />
      </motion.div>

      {/* 4 — scrims so the type reads over the bright snow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[44%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,14,22,0.62) 0%, rgba(8,14,22,0.16) 60%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, rgba(8,14,22,0.74) 0%, rgba(8,14,22,0.28) 45%, transparent 100%)",
        }}
      />

      {/* 4 — drifting snow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="absolute top-[-6vh] block rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.op,
              boxShadow: "0 0 4px rgba(255,255,255,0.7)",
              animation: `snowfall ${f.dur}s linear ${f.delay}s infinite`,
              ["--drift" as string]: `${f.drift}px`,
            }}
          />
        ))}
      </div>

      {/* 5 — names + date, anchored near the top */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[8vh] z-10 flex flex-col items-center px-6 text-center text-white sm:top-[10vh]"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: entering ? 0.5 : 1 }}
      >
        <motion.span
          className="mb-3 text-xs uppercase tracking-[0.5em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          {couple.monogram}
        </motion.span>

        <motion.h1
          className="display text-5xl italic text-white drop-shadow-[0_3px_22px_rgba(0,0,0,0.85)] sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.2 }}
        >
          {couple.names}
        </motion.h1>

        <motion.div
          className="mt-4 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 1 }}
        >
          <span className="h-px w-6 bg-white/60 sm:w-10" />
          {couple.dateDisplay}
          <span className="h-px w-6 bg-white/60 sm:w-10" />
        </motion.div>

        <motion.p
          className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {couple.venue} · {couple.city}
        </motion.p>
      </motion.div>

      {/* 6 — tagline + enter button */}
      <motion.div
        className="relative z-10 mb-[8vh] flex flex-col items-center px-6 text-center text-white"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: entering ? 0.5 : 1 }}
      >
        <motion.p
          className="display max-w-xl text-2xl italic text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] sm:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1.2 }}
        >
          {splash.tagline}
        </motion.p>

        <motion.button
          onClick={enter}
          className="mt-7 rounded-full border border-white/90 bg-black/45 px-9 py-3.5 text-xs uppercase tracking-[0.35em] text-white shadow-[0_10px_34px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {splash.cta}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
