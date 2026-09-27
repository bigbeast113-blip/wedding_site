"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { vision, decoDogs } from "@/content/wedding";
import NightSky from "./motion/NightSky";
import { DogPeek } from "./DogScroll";
import Snowdrift from "./Snowdrift";

/** One word that brightens from a faint ghost to full as the sentence is read. */
function Word({
  word,
  range,
  progress,
  gold,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  gold: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${gold ? "text-gold-grad italic" : ""}`}>
      {word}&nbsp;
    </motion.span>
  );
}

export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.2"] });
  const words = vision.text.split(" ");
  const glow = new Set(vision.highlights.map((w) => w.toLowerCase()));
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");

  return (
    <section ref={ref} data-nav-dark className="relative overflow-hidden bg-night px-6 pb-44 pt-32 text-center md:pb-56 md:pt-44">
      <NightSky stars={60} />
      <Snowdrift edge="top" flip />
      <DogPeek src={decoDogs.duke} side="right" />

      <p className="relative text-[0.68rem] uppercase tracking-[0.5em] text-gold-light sm:text-xs">{vision.eyebrow}</p>
      <p className="relative mx-auto mt-8 max-w-5xl font-serif text-[2.1rem] leading-[1.18] text-ivory sm:text-5xl md:text-6xl md:leading-[1.12]">
        {words.map((word, i) => {
          const start = i / words.length;
          return (
            <Word
              key={i}
              word={word}
              range={[start, start + 1 / words.length]}
              progress={scrollYProgress}
              gold={glow.has(clean(word))}
            />
          );
        })}
      </p>
    </section>
  );
}
