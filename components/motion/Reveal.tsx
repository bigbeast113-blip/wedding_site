"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EXPO } from "./RevealText";

/** Fade + rise into place the first time it scrolls into view. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  duration = 1.1,
  amount = 0.25,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EXPO }}
    >
      {children}
    </motion.div>
  );
}
