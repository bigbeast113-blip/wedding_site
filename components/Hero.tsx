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

  // Background starts exactly where the splash left it (scale 1.05, centered) so
  // the hand-off is seamless, then drifts/zooms gently on scroll.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-svh w-full overflow-hidden">
      {/* Responsive background — must match the splash's (wide desktop / tall
          mobile) so the hand-off from the portal is seamless with no jump. */}
      <motion.img
        src={hero.image}
        alt="Jesse and Francesca"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />
      <motion.img
        src={hero.imageTall}
        alt="Jesse and Francesca"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
      />
      {/* top scrim so the names read over the sky */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,14,22,0.55) 0%, rgba(8,14,22,0.14) 60%, transparent 100%)",
        }}
      />
      {/* light bottom scrim for the scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

      {/* names + date — fade in slowly after the reveal, up top clear of the couple */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="absolute inset-x-0 top-[15vh] flex flex-col items-center px-6 text-center text-white sm:top-[16vh]"
      >
        <motion.span
          className="mb-3 text-xs uppercase tracking-[0.5em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.6 }}
        >
          {couple.monogram}
        </motion.span>
        <motion.h1
          className="display text-6xl italic text-white drop-shadow-[0_3px_22px_rgba(0,0,0,0.75)] sm:text-7xl md:text-8xl lg:text-9xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.8, ease: "easeOut" }}
        >
          {couple.names}
        </motion.h1>
        <motion.div
          className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.6 }}
        >
          <span className="h-px w-8 bg-white/60" />
          {couple.dateDisplay}
          <span className="h-px w-8 bg-white/60" />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1.2 }}
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
      </motion.div>
    </section>
  );
}
