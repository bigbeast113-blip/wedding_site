"use client";

import { motion } from "framer-motion";
import { dateReveal, couple, decoTrees, decoDogs } from "@/content/wedding";
import Petals from "./Petals";
import DecoTree from "./DecoTree";
import { DogTrot } from "./DogScroll";

export default function DateReveal() {
  return (
    <section id="date" className="section-frost relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-32 text-center">
      <Petals count={28} />
      <DecoTree src={decoTrees.left} side="left" width="clamp(64px, 16vw, 240px)" opacity={0.65} />
      <DecoTree src={decoTrees.pineB} side="right" width="clamp(72px, 18vw, 280px)" opacity={0.68} />
      <DogTrot src={decoDogs.daisy} flip />

      <div className="relative z-10">
        <motion.p
          className="font-serif text-2xl italic text-stone sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
        >
          {dateReveal.lead}
        </motion.p>

        <motion.h2
          className="display mt-6 text-[2.75rem] leading-none text-ink sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          {couple.dateDisplay}
        </motion.h2>

        <motion.p
          className="mt-6 px-2 text-[0.6rem] uppercase tracking-[0.18em] text-stone sm:text-sm sm:tracking-[0.35em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {couple.venue} · {couple.city}
        </motion.p>
      </div>
    </section>
  );
}
