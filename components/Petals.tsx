"use client";

import { useMemo } from "react";

/**
 * Gently falling petals / confetti. Deterministic positions seeded by index
 * so the layout is stable across renders.
 */
export default function Petals({ count = 24 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 8) * 0.9;
        const duration = 7 + (i % 5) * 1.6;
        const size = 6 + (i % 4) * 3;
        const hue = i % 3;
        return { left, delay, duration, size, hue };
      }),
    [count]
  );

  const colors = ["#ffffff", "#eaf2f8", "#d4e3ef"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: colors[p.hue],
            opacity: 0.7,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
