"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Desktop-only cursor follower: a soft ring that trails the pointer, swells
 * over anything clickable, and shows a little "view" label over photos you can
 * open. The normal cursor stays visible; touch devices never render this.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState<"none" | "link" | "view">("none");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, [role='button'], input, textarea, label"
      ) as HTMLElement | null;
      if (!el) setHover("none");
      else if (el.dataset.cursor === "view") setHover("view");
      else setHover("link");
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = hover === "view" ? 78 : hover === "link" ? 46 : 22;

  return (
    // Outer layer tracks the pointer; the inner ring centers itself on it.
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200]" style={{ x: sx, y: sy }}>
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: hover === "view" ? "rgba(11,20,32,0.72)" : "rgba(200,164,110,0)",
          borderColor: hover === "view" ? "rgba(230,205,157,0.0)" : "rgba(200,164,110,0.85)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <motion.span
          className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-gold-light"
          animate={{ opacity: hover === "view" ? 1 : 0, scale: hover === "view" ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          view
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
