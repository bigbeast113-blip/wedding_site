"use client";

import { useMemo } from "react";

/**
 * Backdrop for the cinematic "winter night" sections: a deep blue gradient,
 * two slow-drifting glows (warm lantern-gold and a cool aurora blue), and a
 * field of softly twinkling stars. Pure CSS — cheap to render and scroll.
 */
export default function NightSky({
  stars = 70,
  glow = true,
  className = "",
}: {
  stars?: number;
  glow?: boolean;
  className?: string;
}) {
  const pts = useMemo(
    () =>
      Array.from({ length: stars }).map((_, i) => ({
        left: (i * 61.8) % 100,
        top: (i * 37.3 + (i % 7) * 9) % 100,
        size: 1 + (i % 3) * 0.8,
        o: 0.3 + (i % 5) * 0.14,
        dur: 2.6 + (i % 6) * 0.9,
        delay: -((i * 0.77) % 5),
      })),
    [stars]
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #1b2d47 0%, #111f33 40%, #0b1420 78%, #0a121c 100%)",
        }}
      />
      {glow && (
        <>
          <div
            data-deco-anim
            className="absolute -left-[20%] top-[-15%] h-[70%] w-[80%]"
            style={{
              background: "radial-gradient(closest-side, rgba(200,164,110,0.22), rgba(200,164,110,0))",
              animation: "aurora 24s ease-in-out infinite",
            }}
          />
          <div
            data-deco-anim
            className="absolute -right-[25%] top-[25%] h-[70%] w-[80%]"
            style={{
              background: "radial-gradient(closest-side, rgba(120,160,220,0.18), rgba(120,160,220,0))",
              animation: "aurora 30s ease-in-out infinite reverse",
            }}
          />
        </>
      )}
      {pts.map((s, i) => (
        <span
          key={i}
          data-deco-anim
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.o,
            boxShadow: s.size > 2 ? "0 0 6px rgba(255,255,255,0.8)" : undefined,
            ["--o" as string]: s.o,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
