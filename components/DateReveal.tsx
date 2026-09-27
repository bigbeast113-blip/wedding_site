"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { dateReveal, couple, decoTrees, decoDogs } from "@/content/wedding";
import RevealText, { EXPO } from "./motion/RevealText";
import Sparkles from "./Sparkles";
import DecoTree from "./DecoTree";
import { DogTrot } from "./DogScroll";

/**
 * The date as a typographic centerpiece. Scroll-linked (so it reverses when
 * you scroll back up): "December" and "2027" glide in from either side while
 * a giant shimmering gold "11" grows into place between them.
 */
export default function DateReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });

  const monthX = useTransform(scrollYProgress, [0.15, 1], ["-22vw", "0vw"]);
  const yearX = useTransform(scrollYProgress, [0.15, 1], ["22vw", "0vw"]);
  const sideOpacity = useTransform(scrollYProgress, [0.2, 0.75], [0, 1]);
  const dayScale = useTransform(scrollYProgress, [0.1, 1], [0.55, 1]);
  const dayOpacity = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
  const dayRotate = useTransform(scrollYProgress, [0.1, 1], [-6, 0]);

  // Parse "December 11, 2027" -> month / day / year (falls back gracefully).
  const m = couple.dateDisplay.match(/^(\D+)\s+(\d+),?\s+(\d{4})$/);
  const [month, day, year] = m ? [m[1], m[2], m[3]] : [couple.dateDisplay, "", ""];

  return (
    <section
      id="date"
      ref={ref}
      className="relative overflow-hidden bg-ivory px-5 pb-32 pt-28 text-center md:pb-44 md:pt-36"
    >
      <Sparkles count={26} />
      <DecoTree src={decoTrees.left} side="left" width="clamp(64px, 16vw, 240px)" opacity={0.7} />
      <DecoTree src={decoTrees.pineB} side="right" width="clamp(72px, 18vw, 280px)" opacity={0.72} />
      <DogTrot src={decoDogs.daisy} flip />

      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealText as="p" text={dateReveal.lead} className="font-serif text-3xl italic text-stone md:text-4xl" />

        <div className="mt-4 flex flex-col items-center md:mt-2 md:flex-row md:items-center md:justify-center md:gap-10">
          <motion.span style={{ x: monthX, opacity: sideOpacity }} className="display text-6xl text-ink md:text-8xl lg:text-9xl">
            {month}
          </motion.span>
          {day && (
            <motion.span
              style={{ scale: dayScale, opacity: dayOpacity, rotate: dayRotate }}
              className="display text-gold-deep text-gold-shimmer block px-2 text-[46vw] leading-[0.8] md:text-[17rem] lg:text-[21rem]"
            >
              {day}
            </motion.span>
          )}
          <motion.span style={{ x: yearX, opacity: sideOpacity }} className="display text-6xl text-ink md:text-8xl lg:text-9xl">
            {year}
          </motion.span>
        </div>

        <motion.div
          className="mt-8 flex items-center justify-center gap-4 md:mt-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: EXPO }}
        >
          <span className="h-px w-6 flex-none bg-gradient-to-l from-gold to-transparent sm:w-10 md:w-20" />
          <span className="text-balance font-serif text-lg italic text-ink/80 md:text-2xl">
            {dateReveal.day} · {dateReveal.time}
          </span>
          <span className="h-px w-6 flex-none bg-gradient-to-r from-gold to-transparent sm:w-10 md:w-20" />
        </motion.div>
        <motion.p
          className="mt-4 text-balance text-[0.66rem] uppercase tracking-[0.4em] text-gold-dark md:text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, delay: 0.25 }}
        >
          {couple.venue} · {couple.city}
        </motion.p>
      </div>
    </section>
  );
}
