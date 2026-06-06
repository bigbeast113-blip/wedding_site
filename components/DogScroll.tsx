"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/** Daisy runs across the bottom of a section once it scrolls into view.
 *  Triggered by an on-screen sentinel so the dog can start off-screen. */
export function DogTrot({
  src,
  width = "clamp(78px, 9vw, 130px)",
  flip = true,
  duration = 5.5,
}: {
  src: string;
  width?: string;
  flip?: boolean;
  duration?: number;
}) {
  const trigger = useRef<HTMLSpanElement>(null);
  const go = useInView(trigger, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <>
      <span ref={trigger} aria-hidden className="absolute bottom-1/4 left-1/2 h-px w-px" />
      <motion.div
        className="pointer-events-none absolute bottom-2 left-0 z-0 select-none"
        initial={{ x: "-22vw", opacity: 0 }}
        animate={go ? { x: "118vw", opacity: [0, 1, 1, 1, 0] } : { x: "-22vw", opacity: 0 }}
        transition={{ duration, ease: "linear", opacity: { duration, times: [0, 0.06, 0.5, 0.94, 1] } }}
      >
        <img
          src={src}
          alt=""
          aria-hidden
          className={`block drop-shadow-[0_8px_8px_rgba(20,30,40,0.18)] ${flip ? "-scale-x-100" : ""}`}
          style={{ width }}
        />
      </motion.div>
    </>
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
