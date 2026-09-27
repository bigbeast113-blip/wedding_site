"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { flyThrough } from "@/content/wedding";
import NightSky from "./motion/NightSky";
import RevealText from "./motion/RevealText";
import { useLightbox } from "./Lightbox";

/**
 * A 3D fly-through of photos floating in the winter night. Each photo sits at
 * a point in space (x, y in vw/vh from center, z = depth). Scrolling moves a
 * virtual camera forward along z, so with simple perspective (scale = 1/dist)
 * every photo grows, drifts outward and sweeps past you — the same "rush past
 * the camera" language as the portal intro. Transforms + opacity only.
 */
// Photos are spread with the golden angle (even spacing all the way round the
// title), nudged wider when they sit near the horizontal band the words live in.
const GOLDEN = 2.399963;
const SLOTS = Array.from({ length: 24 }).map((_, i) => {
  const a = Math.PI / 2 + i * GOLDEN;
  const nearBand = Math.abs(Math.sin(a)) < 0.45;
  const r = (nearBand ? 34 : 27) + (i % 3) * 3;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.82, z: 1 + i * 0.62 };
});
const CAM_START = -1.6; // camera starts behind the nearest photo
// The flight is over by FLIGHT_END and the sunrise bloom has filled the screen
// by BLOOM_END; the story section then slides up over that ivory frame (it
// overlaps the last (1 - BLOOM_END) of this section), so there's no blank gap.
const FLIGHT_END = 0.88;
const BLOOM_END = 0.9;

function FlyPhoto({
  src,
  all,
  slot,
  progress,
  base,
  camEnd,
}: {
  src: string;
  all: string[];
  slot: { x: number; y: number; z: number };
  progress: MotionValue<number>;
  base: number;
  camEnd: number;
}) {
  const openLightbox = useLightbox();
  // distance from the camera to this photo
  const d = useTransform(progress, (p) => slot.z - (CAM_START + Math.min(1, p / FLIGHT_END) * (camEnd - CAM_START)));
  const s = useTransform(d, (v) => (v <= 0.12 ? 8.3 : Math.min(8.3, 1 / v)));
  const x = useTransform(s, (v) => `${slot.x * v}vw`);
  const y = useTransform(s, (v) => `${slot.y * v}vh`);
  const opacity = useTransform(d, (v) => {
    if (v <= 0.14) return 0;
    const fromFar = Math.min(1, Math.max(0, (7.2 - v) / 2.2)); // emerges from the dark
    const passing = Math.min(1, Math.max(0, (v - 0.14) / 0.34)); // fades as it rushes past
    return Math.min(fromFar, passing);
  });
  const zIndex = useTransform(d, (v) => (v < 0.9 ? 60 : Math.round(40 - v)));
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: `${base}vw`, zIndex, visibility }}
    >
      <motion.button
        type="button"
        onClick={() => openLightbox(src, all)}
        aria-label="View photo full screen"
        data-cursor="view"
        style={{ x, y, scale: s, opacity }}
        className="block w-full overflow-hidden rounded-[3px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/15 will-change-transform"
      >
        <img src={src} alt="" loading="lazy" decoding="async" className="block h-auto w-full" />
      </motion.button>
    </motion.div>
  );
}

export default function FlyThrough() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [base, setBase] = useState(24);
  useEffect(() => {
    const f = () => setBase(window.innerWidth < 640 ? 38 : window.innerWidth < 1024 ? 28 : 23);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  // stars stretch outward a little as we fly = extra sense of speed
  const photos = flyThrough.photos;
  // finish just after the farthest photo has passed the camera
  const camEnd = SLOTS[Math.min(photos.length, SLOTS.length) - 1].z + 0.6;
  const starScale = useTransform(scrollYProgress, [0, 1], [1, 1.8]);
  // Flying "into the light": an ivory bloom with a warm gold halo opens from
  // the centre until it fills the screen and becomes the next section. (A flat
  // fade would pass through a muddy grey on the way from navy to ivory.)
  // The halo runs through sunrise colours (champagne → amber → dusky rose), which
  // stay luminous against the navy where a plain ivory fade turns khaki.
  const bloom = useTransform(scrollYProgress, [0.72, BLOOM_END], [-50, 100]);
  const dawn = useTransform(
    bloom,
    (r) =>
      `radial-gradient(circle at 50% 50%, rgb(246,241,233) ${r}%, rgb(242,226,198) ${r + 8}%, rgba(231,186,132,0.9) ${r + 19}%, rgba(168,112,118,0.5) ${r + 32}%, rgba(60,48,84,0) ${r + 48}%)`
  );
  // the title is read first, then dissolves as the flight picks up speed
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.56], [1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 1], [0.94, 1.08]);
  // a star + scroll cue at the heart of the light; the story never covers the
  // middle of this frame, so it stays until the story's first lines arrive
  const ornament = useTransform(scrollYProgress, [0.82, 0.88], [0, 1]);

  return (
    <section ref={ref} className="relative h-[380vh] bg-night" aria-label="A few of our favorite moments">
      {/* night nav styling until the bloom reaches the top of the screen (~87%) */}
      <div aria-hidden data-nav-dark className="pointer-events-none absolute inset-x-0 top-0 h-[calc(244vh+44px)]" />
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: starScale }}>
          <NightSky stars={90} />
        </motion.div>
        {/* seamless join with the darkened hero above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-night via-night/60 to-transparent" />

        {photos.slice(0, SLOTS.length).map((src, i) => (
          <FlyPhoto key={src} src={src} all={photos} slot={SLOTS[i]} progress={scrollYProgress} base={base} camEnd={camEnd} />
        ))}

        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none absolute inset-0 z-[64]"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 26% at 50% 50%, rgba(11,20,32,0.62), rgba(11,20,32,0) 100%)" }}
          />
        </motion.div>
        <motion.div
          style={{ opacity: textOpacity, scale: textScale }}
          className="pointer-events-none absolute inset-0 z-[65] flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <p className="relative text-[0.68rem] uppercase tracking-[0.5em] text-gold-light [text-shadow:0_2px_14px_rgba(0,0,0,0.95)] sm:text-xs">
            {flyThrough.eyebrow}
          </p>
          <RevealText
            as="h2"
            text={flyThrough.heading}
            className="display relative mt-5 max-w-4xl text-5xl text-ivory [filter:drop-shadow(0_4px_24px_rgba(0,0,0,0.85))_drop-shadow(0_1px_3px_rgba(0,0,0,0.6))] sm:text-7xl md:text-8xl"
            amount={0.3}
            tokenClass={(w) => (w === "celebrating" ? "text-gold-grad italic" : undefined)}
          />
        </motion.div>

        {/* soft vignette so photos emerge from, and melt back into, the dark */}
        <div
          className="pointer-events-none absolute inset-0 z-[55]"
          style={{ background: "radial-gradient(120% 90% at 50% 50%, rgba(11,20,32,0) 55%, rgba(11,20,32,0.65) 100%)" }}
        />
        <motion.div className="pointer-events-none absolute inset-0 z-[70]" style={{ backgroundImage: dawn }} />
        <motion.div
          aria-hidden
          style={{ opacity: ornament }}
          className="pointer-events-none absolute inset-0 z-[71] flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-16 bg-gradient-to-l from-gold to-transparent md:w-28" />
            <span className="text-sm text-gold">✦</span>
            <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent md:w-28" />
          </div>
          <span className="relative mt-6 block h-12 w-px overflow-hidden bg-gold/15">
            <span data-deco-anim className="scroll-drip absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent to-gold" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
