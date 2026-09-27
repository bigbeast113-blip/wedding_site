"use client";

import { useMemo } from "react";

/**
 * Tiny champagne-gold flecks drifting down — the ivory sections' answer to
 * the snowfall in the night sections. Deterministic layout, pure CSS.
 */
export default function Sparkles({ count = 24 }: { count?: number }) {
  const flecks = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: (i * 37.7) % 100,
        delay: -((i * 1.3) % 11),
        duration: 9 + (i % 5) * 2.2,
        size: 2 + (i % 4) * 1.3,
        color: ["#c8a46e", "#e6cd9d", "#d9bb86", "#b99461"][i % 4],
        o: 0.35 + (i % 4) * 0.12,
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flecks.map((f, i) => (
        <span
          key={i}
          data-deco-anim
          className="absolute top-0 block rotate-45"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            background: f.color,
            opacity: f.o,
            borderRadius: i % 3 === 0 ? "1px" : "9999px",
            animation: `fall ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
