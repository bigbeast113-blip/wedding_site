"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * A watercolor pine that sits at the bottom corner of a section and gently
 * drifts (parallax) + fades in as you scroll past. Decorative only — sits
 * behind the section's text and never blocks clicks.
 */
export default function DecoTree({
  src,
  side = "left",
  width = "clamp(110px, 14vw, 220px)",
  opacity = 0.6,
  bottom = "0px",
}: {
  src: string;
  side?: "left" | "right";
  width?: string;
  opacity?: number;
  bottom?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [70, -55]);

  const sidePos =
    side === "left" ? "left-[-1rem] sm:left-[1%]" : "right-[-1rem] sm:right-[1%]";

  return (
    <motion.img
      ref={ref}
      src={src}
      alt=""
      aria-hidden
      style={{ y, width, bottom }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity }}
      viewport={{ once: false, amount: 0.05 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`pointer-events-none absolute z-0 select-none drop-shadow-[0_8px_16px_rgba(20,30,40,0.18)] ${sidePos}`}
    />
  );
}
