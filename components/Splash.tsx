"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { splash, couple } from "@/content/wedding";

const ZOOM = { duration: 1.9, ease: [0.5, 0, 0.85, 0.4] as const };
const REST = { duration: 1.2, ease: "easeOut" as const };

// Soft feather so foreground branches melt away at every edge (no hard lines).
const softEdge =
  "radial-gradient(ellipse 72% 80% at 50% 52%, #000 30%, rgba(0,0,0,0.55) 60%, transparent 86%)";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  const [entering, setEntering] = useState(false);

  const mx = useSpring(0, { stiffness: 55, damping: 16, mass: 0.5 });
  const my = useSpring(0, { stiffness: 55, damping: 16, mass: 0.5 });

  const bgX = useTransform(mx, (v) => v * 8);
  const bgY = useTransform(my, (v) => v * 6);
  const coX = useTransform(mx, (v) => v * 15);
  const coY = useTransform(my, (v) => v * 11);
  const flX = useTransform(mx, (v) => v * 55); // foreground branches (closest)
  const flY = useTransform(my, (v) => v * 40);
  const topX = useTransform(mx, (v) => v * 38);
  const topY = useTransform(my, (v) => v * 28);

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
    window.setTimeout(onEnter, 850);
  }

  const z = (s: number, x?: string, y?: string) =>
    entering ? { scale: s, x: x ?? "0%", y: y ?? "0%" } : { scale: 1, x: "0%", y: "0%" };

  return (
    <motion.div
      onMouseMove={handleMouse}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-[#aeb7bd]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* 1 — full snowy-forest scene (no tiling, no seams) */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY }}>
        <motion.img
          src={splash.backdrop}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover"
          animate={entering ? { scale: 1.5 } : { scale: 1.1 }}
          transition={entering ? ZOOM : REST}
        />
      </motion.div>

      {/* 2 — faint blurred branches up high for depth (feathered, no hard edges) */}
      <motion.div className="absolute inset-0" style={{ x: topX, y: topY }}>
        <motion.img
          src={splash.foliage}
          alt=""
          className="absolute -left-[8%] -top-[10%] w-[42%] -scale-x-100 blur-[7px]"
          style={{ maskImage: softEdge, WebkitMaskImage: softEdge, opacity: 0.35 }}
          animate={z(2.2, "-30%", "-30%")}
          transition={entering ? ZOOM : REST}
        />
        <motion.img
          src={splash.foliage}
          alt=""
          className="absolute -right-[8%] -top-[10%] w-[42%] blur-[7px]"
          style={{ maskImage: softEdge, WebkitMaskImage: softEdge, opacity: 0.35 }}
          animate={z(2.2, "30%", "-30%")}
          transition={entering ? ZOOM : REST}
        />
      </motion.div>

      {/* 3 — the two of you, standing in the woods (cooled to match the scene) */}
      <motion.div className="absolute inset-0 flex items-end justify-center" style={{ x: coX, y: coY }}>
        <motion.img
          src={splash.couple}
          alt={couple.names}
          className="max-h-[72vh] w-auto object-contain"
          style={{
            marginBottom: "2vh",
            filter:
              "saturate(0.82) brightness(0.96) contrast(1.03) drop-shadow(0 22px 26px rgba(15,22,30,0.5))",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={entering ? { opacity: 1, scale: 2.5, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
          transition={entering ? ZOOM : { opacity: { duration: 1.4 }, default: REST }}
        />
      </motion.div>

      {/* 4 — bottom mist: veils the cutout's lower edge so you melt into the snow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "linear-gradient(to top, rgba(228,236,242,0.92) 0%, rgba(228,236,242,0.55) 35%, rgba(228,236,242,0) 100%)",
        }}
      />

      {/* 5 — soft, out-of-focus foreground branches at the bottom corners */}
      <motion.div className="absolute inset-0" style={{ x: flX, y: flY }}>
        <motion.img
          src={splash.foliage}
          alt=""
          className="absolute -bottom-[14%] -left-[10%] w-[56%] blur-[9px]"
          style={{ maskImage: softEdge, WebkitMaskImage: softEdge, opacity: 0.55 }}
          animate={z(2.8, "-30%", "30%")}
          transition={entering ? ZOOM : REST}
        />
        <motion.img
          src={splash.foliage}
          alt=""
          className="absolute -bottom-[14%] -right-[10%] w-[58%] -scale-x-100 blur-[10px]"
          style={{ maskImage: softEdge, WebkitMaskImage: softEdge, opacity: 0.55 }}
          animate={z(3.0, "30%", "30%")}
          transition={entering ? ZOOM : REST}
        />
      </motion.div>

      {/* 6 — unifying cool wash + vignette so everything shares one light */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(120,140,170,0.1)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 75% at 50% 42%, rgba(10,16,24,0) 45%, rgba(10,16,24,0.28) 78%, rgba(10,16,24,0.6) 100%)",
        }}
      />

      {/* 7 — drifting snow */}
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

      {/* 8 — tagline + enter button */}
      <motion.div
        className="relative z-10 mb-[12vh] flex flex-col items-center px-6 text-center text-white"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: entering ? 0.5 : 1 }}
      >
        <motion.span
          className="mb-3 text-xs uppercase tracking-[0.5em] text-white/80 drop-shadow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          {couple.monogram}
        </motion.span>

        <motion.p
          className="display max-w-xl text-3xl italic text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        >
          {splash.tagline}
        </motion.p>

        <motion.button
          onClick={enter}
          className="mt-8 rounded-full border border-white/80 bg-black/35 px-8 py-3 text-xs uppercase tracking-[0.35em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {splash.cta}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
