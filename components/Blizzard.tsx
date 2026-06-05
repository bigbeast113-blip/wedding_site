"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * A one-shot blizzard gust that fires when this marker scrolls into view:
 * fast wind-driven snow streaks sweep across the viewport with a brief
 * white-out bloom, then clear. Drop <Blizzard /> at the top of any section.
 */
export default function Blizzard({
  count = 110,
  direction = "right",
  tone = "snow",
}: {
  count?: number;
  direction?: "right" | "left";
  // "snow" = white (best over dark/photo sections); "frost" = blue-grey
  // (shows up over light frosted-glass sections).
  tone?: "snow" | "frost";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const streakColor = tone === "frost" ? "rgba(120,150,185,0.7)" : "#ffffff";
  const streakShadow =
    tone === "frost" ? "0 0 6px rgba(110,145,185,0.55)" : "0 0 6px rgba(255,255,255,0.8)";
  const bloomColor = tone === "frost" ? "rgba(206,224,244,0.55)" : "rgba(255,255,255,1)";
  const bloomPeak = tone === "frost" ? 0.4 : 0.5;

  const streaks = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const top = (i * 41) % 100;
        const len = 30 + (i % 6) * 18; // px
        const thick = 1.4 + (i % 3) * 0.9;
        const op = 0.45 + (i % 5) * 0.11;
        const dur = 0.6 + (i % 7) * 0.12;
        const delay = ((i * 13) % 100) / 100; // 0..1s
        const drop = 30 + (i % 5) * 26; // downward drift (vh fraction)
        return { top, len, thick, op, dur, delay, drop };
      }),
    [count]
  );

  const from = direction === "right" ? "-14vw" : "114vw";
  const to = direction === "right" ? "118vw" : "-18vw";

  return (
    <>
      {/* marker that triggers the gust when the section reaches it */}
      <div ref={ref} aria-hidden className="absolute left-0 top-1/4 h-1 w-full" />

      {inView && (
        <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
          {/* white-out bloom */}
          <motion.div
            className="absolute inset-0"
            style={{ background: bloomColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, bloomPeak, 0] }}
            transition={{ duration: 1.9, times: [0, 0.35, 1], ease: "easeInOut" }}
          />
          {/* driven snow streaks */}
          {streaks.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${s.top}%`,
                width: s.len,
                height: s.thick,
                left: 0,
                background: streakColor,
                filter: "blur(0.6px)",
                boxShadow: streakShadow,
              }}
              initial={{ x: from, y: 0, opacity: 0 }}
              animate={{ x: to, y: `${s.drop}px`, opacity: [0, s.op, s.op, 0] }}
              transition={{
                duration: s.dur,
                delay: s.delay,
                ease: "easeIn",
                opacity: { duration: s.dur, delay: s.delay, times: [0, 0.1, 0.8, 1] },
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
