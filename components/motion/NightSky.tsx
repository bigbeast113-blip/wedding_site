"use client";

import { useId, useMemo } from "react";

// three twinkle rhythms, so neighbouring stars never pulse in unison
const RHYTHM = [
  { dur: 3.4, delay: -0.6 },
  { dur: 4.7, delay: -2.1 },
  { dur: 6.1, delay: -3.9 },
];

/**
 * Backdrop for the cinematic "winter night" sections: a deep blue gradient,
 * two slow-drifting glows (warm lantern-gold and a cool aurora blue), and a
 * field of softly twinkling stars.
 *
 * The stars are drawn into three static SVG layers that each twinkle as a
 * whole — three GPU layers per sky instead of one per star. (Hundreds of
 * separately animated dots made fast scrolling stutter on phones.)
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
  const halo = `halo${useId().replace(/:/g, "")}`;
  const groups = useMemo(() => {
    const g: { x: number; y: number; r: number; o: number }[][] = [[], [], []];
    for (let i = 0; i < stars; i++) {
      g[(i + Math.floor(i / 5)) % 3].push({
        x: (i * 61.8) % 100,
        y: (i * 37.3 + (i % 7) * 9) % 100,
        r: (1 + (i % 3) * 0.8) / 2,
        o: 0.3 + (i % 5) * 0.14,
      });
    }
    return g;
  }, [stars]);

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
            className="aurora-glow absolute -left-[20%] top-[-15%] h-[70%] w-[80%]"
            style={{
              background: "radial-gradient(closest-side, rgba(200,164,110,0.22), rgba(200,164,110,0))",
              animationDuration: "24s",
            }}
          />
          <div
            data-deco-anim
            className="aurora-glow absolute -right-[25%] top-[25%] h-[70%] w-[80%]"
            style={{
              background: "radial-gradient(closest-side, rgba(120,160,220,0.18), rgba(120,160,220,0))",
              animationDuration: "30s",
              animationDirection: "reverse",
            }}
          />
        </>
      )}
      {groups.map((pts, g) => (
        <svg
          key={g}
          data-deco-anim
          className="twinkle-group absolute inset-0 h-full w-full"
          style={{ animationDuration: `${RHYTHM[g].dur}s`, animationDelay: `${RHYTHM[g].delay}s` }}
        >
          {g === 0 && (
            <defs>
              <radialGradient id={halo}>
                <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
          )}
          {pts.map((s, i) =>
            s.r > 1 ? (
              <g key={i}>
                <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 3.4} fill={`url(#${halo})`} />
                <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o} />
              </g>
            ) : (
              <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o} />
            )
          )}
        </svg>
      ))}
    </div>
  );
}
