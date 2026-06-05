"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { closing, couple } from "@/content/wedding";
import Blizzard from "./Blizzard";

export default function Closing({ onRsvp }: { onRsvp: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="closing" ref={ref} className="relative h-screen w-full overflow-hidden">
      <Blizzard direction="left" />
      <motion.img
        src={closing.image}
        alt=""
        style={{ y: bgY, scale: 1.15 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="display max-w-3xl text-3xl italic text-white drop-shadow-lg sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
        >
          {closing.line}
        </motion.p>

        <motion.button
          onClick={onRsvp}
          className="mt-10 rounded-full bg-rust px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-rust-dark"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.04 }}
        >
          Submit RSVP
        </motion.button>

        <div className="absolute bottom-8 text-xs uppercase tracking-[0.35em] text-white/70">
          {couple.names} · {couple.dateDisplay}
        </div>
      </div>
    </section>
  );
}
