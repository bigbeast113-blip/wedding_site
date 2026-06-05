"use client";

import { useMemo } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";

/**
 * Full-page falling snow. Fixed and pointer-events-none so it drifts over all
 * content as you scroll, but never blocks clicks (z-40, below modals). The
 * whole field blows sideways based on scroll velocity, so fast scrolling kicks
 * up a windy flurry.
 */
export default function Snow({ count = 60 }: { count?: number }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  // Fast scroll -> stronger sideways wind. Smoothed so it eases in/out.
  const windRaw = useTransform(velocity, [-4000, 0, 4000], [140, 0, -140]);
  const wind = useSpring(windRaw, { stiffness: 40, damping: 15, mass: 0.7 });
  const skew = useTransform(wind, [-140, 140], [8, -8]);

  const flakes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 5) * 1.4;
        const duration = 9 + (i % 7) * 2.2;
        const delay = -((i * 1.7) % duration); // negative = already mid-fall on load
        const drift = (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6);
        const opacity = 0.4 + (i % 5) * 0.12;
        return { left, size, duration, delay, drift, opacity };
      }),
    [count]
  );

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-[-20vw] z-40 h-full w-[140vw] overflow-hidden"
      style={{ x: wind, skewX: skew }}
    >
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-[-5vh] block rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            boxShadow: "0 0 4px rgba(255,255,255,0.7)",
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </motion.div>
  );
}
