"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Daisy is scroll-linked: as you scroll down she runs in from the left and
 * settles next to the first tree on the left, staying there. Scroll back up
 * and she runs back out — the animation reverses with scroll like the rest.
 */
export function DogTrot({
  src,
  width = "clamp(78px, 9vw, 130px)",
  flip = true,
  end = "5vw",
}: {
  src: string;
  width?: string;
  flip?: boolean;
  end?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Run in during the first part of the section, then hold at the tree.
  const x = useTransform(scrollYProgress, [0.08, 0.5], ["-24vw", end]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.14], [0, 1]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0 select-none">
      <motion.div className="absolute bottom-2 left-0" style={{ x, opacity }}>
        <img
          src={src}
          alt=""
          aria-hidden
          className={`block drop-shadow-[0_8px_8px_rgba(20,30,40,0.18)] ${flip ? "-scale-x-100" : ""}`}
          style={{ width }}
        />
      </motion.div>
    </div>
  );
}

/** Duke peeks up over the bottom edge of a section (parent needs overflow-hidden). */
export function DogPeek({
  src,
  side = "right",
  width = "clamp(94px, 12vw, 150px)",
}: {
  src: string;
  side?: "left" | "right";
  width?: string;
}) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute -bottom-[10%] z-20 select-none drop-shadow-[0_6px_14px_rgba(20,30,40,0.22)] ${
        side === "right" ? "right-[5%]" : "left-[5%]"
      }`}
      style={{ width }}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0.15 }}
    />
  );
}
