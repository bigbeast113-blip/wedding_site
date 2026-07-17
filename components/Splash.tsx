"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { splash } from "@/content/wedding";

// The enter animation: the foliage layers accelerate toward the viewer and fly
// off, leaving the full background. Ease accelerates so they "rush" past.
const FLY = { duration: 1.7, ease: [0.4, 0, 0.85, 0.35] as const };
const REST = { duration: 1.2, ease: "easeOut" as const };

export default function Splash({ onEnter }: { onEnter: () => void }) {
  const [entering, setEntering] = useState(false);

  // Gentle mouse parallax (disabled once entering). Near foliage moves most.
  const mx = useSpring(0, { stiffness: 50, damping: 16, mass: 0.5 });
  const my = useSpring(0, { stiffness: 50, damping: 16, mass: 0.5 });
  const bgX = useTransform(mx, (v) => v * 3);
  const bgY = useTransform(my, (v) => v * 2);
  const frX = useTransform(mx, (v) => v * 9);
  const frY = useTransform(my, (v) => v * 6);
  const nrX = useTransform(mx, (v) => v * 18);
  const nrY = useTransform(my, (v) => v * 12);

  const flakes = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 4) * 1.5;
        const dur = 8 + (i % 6) * 2;
        const delay = -((i * 1.9) % dur);
        const drift = (i % 2 ? 1 : -1) * (10 + (i % 4) * 8);
        return { left, size, dur, delay, drift, op: 0.35 + (i % 4) * 0.12 };
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
    // Hand off once the foliage has mostly flown past; the background is the
    // same image as the hero, so the swap is invisible.
    window.setTimeout(onEnter, 1450);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onClick={enter}
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-[#0b1420]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* BACK — the proposal scene (stays; revealed as the foliage flies off) */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY }}>
        <img
          src={splash.bg}
          alt=""
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover sm:block"
        />
        <img
          src={splash.bgTall}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover sm:hidden"
        />
      </motion.div>

      {/* FAR foliage — the archway (center cut out) */}
      <motion.div className="absolute inset-0" style={{ x: frX, y: frY }}>
        <motion.img
          src={splash.frame}
          alt=""
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover sm:block"
          animate={entering ? { scale: 3, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? FLY : REST}
        />
        <motion.img
          src={splash.frameTall}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover sm:hidden"
          animate={entering ? { scale: 3, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? FLY : REST}
        />
      </motion.div>

      {/* NEAR foliage — the closest snow bank; flies past fastest */}
      <motion.div className="absolute inset-0" style={{ x: nrX, y: nrY }}>
        <motion.img
          src={splash.near}
          alt=""
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover sm:block"
          animate={entering ? { scale: 5, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? { ...FLY, duration: 1.4 } : REST}
        />
        <motion.img
          src={splash.nearTall}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover sm:hidden"
          animate={entering ? { scale: 5, opacity: 0 } : { scale: 1.05, opacity: 1 }}
          transition={entering ? { ...FLY, duration: 1.4 } : REST}
        />
      </motion.div>

      {/* drifting snow */}
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

      {/* subtle wordless "click to enter" cue — a soft pulsing ring */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[8vh] z-10 flex justify-center"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.span
          className="block h-12 w-12 rounded-full border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
