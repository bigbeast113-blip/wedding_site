"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Snow + confetti in the site's palette.
const COLORS = ["#ffffff", "#b5613a", "#cfe0ec", "#5c7160", "#e9c46a", "#ffffff", "#f4f8fa"];

/**
 * A one-shot celebratory burst (snow + confetti) from the center of the screen.
 * Mount it to fire it — used when a guest joyfully accepts their RSVP.
 */
export default function Burst({ count = 70 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (Math.random() * 180 - 90) * (Math.PI / 180); // fan upward/outward
        const dist = 140 + Math.random() * 300;
        const xEnd = Math.cos(angle) * dist;
        const yEnd = -Math.abs(Math.sin(angle) * dist) - 40; // up & out
        const fall = 240 + Math.random() * 320; // then gravity
        const size = 6 + Math.random() * 9;
        const round = Math.random() > 0.45;
        return {
          xEnd,
          yEnd,
          fall,
          size,
          round,
          color: COLORS[i % COLORS.length],
          rot: Math.random() * 720 - 360,
          dur: 1.7 + Math.random() * 1.4,
          delay: Math.random() * 0.15,
        };
      }),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "9999px" : "1px",
            boxShadow: "0 0 5px rgba(255,255,255,0.35)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.xEnd, y: [0, p.yEnd, p.yEnd + p.fall], opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut", times: [0, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
