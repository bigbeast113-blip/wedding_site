"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { scatterPhotos, couple } from "@/content/wedding";
import { useLightbox } from "./Lightbox";

// Target resting positions for each scattered photo (as % offsets from center)
const layout = [
  { x: -34, y: -18, r: -8, w: 190 },
  { x: -30, y: 20, r: 6, w: 160 },
  { x: 33, y: -22, r: 7, w: 150 },
  { x: 36, y: 16, r: -6, w: 200 },
  { x: 0, y: 30, r: 3, w: 150 },
];

function ScatterImg({
  src,
  i,
  progress,
}: {
  src: string;
  i: number;
  progress: MotionValue<number>;
}) {
  const pos = layout[i % layout.length];
  const openLightbox = useLightbox();
  const x = useTransform(progress, [0, 1], ["0%", `${pos.x}vw`]);
  const y = useTransform(progress, [0, 1], ["0%", `${pos.y}vh`]);
  const rotate = useTransform(progress, [0, 1], [0, pos.r]);
  const opacity = useTransform(progress, [0, 0.25, 1], [0, 1, 1]);

  return (
    <motion.img
      src={src}
      alt=""
      onClick={() => openLightbox(src)}
      style={{ x, y, rotate, opacity, width: pos.w }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md border-[6px] border-white object-cover shadow-2xl"
    />
  );
}

export default function PhotoScatter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.96]);

  return (
    <section ref={ref} className="section-frost relative h-[180vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {scatterPhotos.map((src, i) => (
          <ScatterImg key={i} src={src} i={i} progress={scrollYProgress} />
        ))}

        <motion.div
          style={{ scale: cardScale }}
          className="relative z-10 rounded-lg bg-paper/90 px-12 py-10 text-center shadow-xl backdrop-blur-sm"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-stone">together</p>
          <h2 className="display mt-2 text-5xl italic text-ink sm:text-6xl">
            {couple.names}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
