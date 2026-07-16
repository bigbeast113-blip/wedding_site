"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero, couple } from "@/content/wedding";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background drifts up slowly (parallax); names drift faster and fade.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-svh w-full overflow-hidden">
      {/* Intro "settle" zoom: the hero appears already pushed-in and eases to
          rest, continuing the splash dive so the hand-off feels seamless. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.45 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.7, ease: [0.22, 0.1, 0.25, 1] }}
      >
        <motion.img
          src={hero.image}
          alt="The couple"
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center sm:pb-28"
      >
        <h1 className="display px-6 text-6xl italic text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl lg:text-9xl">
          {couple.names}
        </h1>
        <p className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] sm:text-sm">
          <span className="h-px w-8 bg-white/60" />
          {couple.dateDisplay}
          <span className="h-px w-8 bg-white/60" />
        </p>
      </motion.div>

      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-white/80">
          {hero.scrollHint}
        </span>
        <motion.div
          className="mx-auto mt-3 h-8 w-px bg-white/60"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
