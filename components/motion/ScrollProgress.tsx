"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hair-thin champagne-gold line across the top that fills as you scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #8a6a3c, #e6cd9d 50%, #c8a46e)",
        boxShadow: "0 0 10px rgba(230,205,157,0.6)",
      }}
    />
  );
}
