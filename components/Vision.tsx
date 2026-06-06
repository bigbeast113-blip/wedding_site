"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { vision, decoTrees, decoDogs } from "@/content/wedding";
import DecoTree from "./DecoTree";
import { DogPeek } from "./DogScroll";

export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = vision.text.split(" ");

  return (
    <section ref={ref} className="section-frost relative overflow-hidden px-6 py-32">
      <DecoTree src={decoTrees.right} side="left" width="clamp(95px, 11vw, 175px)" opacity={0.5} />
      <DogPeek src={decoDogs.duke} side="right" />
      <p className="mx-auto max-w-4xl text-center font-serif text-3xl leading-snug text-ink sm:text-4xl md:text-5xl">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
          return (
            <motion.span key={i} style={{ opacity }} className="inline-block">
              {word}&nbsp;
            </motion.span>
          );
        })}
      </p>
    </section>
  );
}
