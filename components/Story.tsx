"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { story, type Chapter } from "@/content/wedding";
import RevealText, { EXPO } from "./motion/RevealText";
import { useLightbox } from "./Lightbox";

// every story photo, in reading order, so the lightbox can page through them
const STORY_PHOTOS = story.chapters.flatMap((c) => c.photos);

/**
 * "our story" as a pinned horizontal reel: the section sticks to the screen
 * and scrolling down glides the chapters sideways past you. Each chapter is a
 * photo collage + an oversized chapter number; photos drift at a different
 * speed than the reel for depth, and wipe into view as they arrive.
 */
const NUM = ["one", "two", "three", "four", "five", "six"];

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const f = () => setM(window.innerWidth < 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return m;
}

/** Natural aspect ratio (w/h) of an image, so frames never crop awkwardly. */
function useAspect(src: string, fallback = 0.8) {
  const [a, setA] = useState(fallback);
  useEffect(() => {
    const img = new Image();
    img.onload = () => img.naturalHeight && setA(img.naturalWidth / img.naturalHeight);
    img.src = src;
  }, [src]);
  return a;
}

function Photo({
  src,
  width,
  aspect,
  drift,
  className = "",
  delay = 0,
  framed = false,
}: {
  src: string;
  width: string;
  aspect: number;
  drift: MotionValue<string>;
  className?: string;
  delay?: number;
  framed?: boolean;
}) {
  const openLightbox = useLightbox();
  // Watch the unclipped outer box — a fully clip-pathed element never counts
  // as "in view", so it could never reveal itself.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width }}>
      <motion.button
        type="button"
        onClick={() => openLightbox(src, STORY_PHOTOS)}
        aria-label="View photo full screen"
        data-cursor="view"
        className={`relative block w-full ${
          framed ? "bg-white p-1.5 shadow-[0_20px_45px_rgba(28,26,23,0.28)] md:p-2" : "shadow-[0_30px_60px_rgba(28,26,23,0.22)]"
        }`}
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
        transition={{ duration: 1.3, delay, ease: EXPO }}
      >
        <span className="relative block w-full overflow-hidden" style={{ aspectRatio: aspect }}>
          <motion.img
            src={src}
            alt=""
            decoding="async"
            style={{ x: drift, scale: 1.16 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </span>
      </motion.button>
    </div>
  );
}

function ChapterPanel({
  chapter,
  index,
  progress,
  total,
  mobile,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
  total: number;
  mobile: boolean;
}) {
  const [mainSrc, sideSrc] = chapter.photos;
  const mainA = useAspect(mainSrc);
  const sideA = useAspect(sideSrc ?? mainSrc);
  const title = chapter.title.includes(":") ? chapter.title.split(":")[1].trim() : chapter.title;

  // when this panel is centered on screen (intro + chapters + outro evenly spaced)
  const center = (index + 1) / (total + 1);
  const driftMain = useTransform(progress, [center - 0.4, center + 0.4], ["6%", "-6%"]);
  const driftSide = useTransform(progress, [center - 0.4, center + 0.4], ["14%", "-14%"]);
  const numX = useTransform(progress, [center - 0.4, center + 0.4], ["30%", "-30%"]);

  const mainW = mobile
    ? mainA >= 1 ? "78vw" : "52vw"
    : mainA >= 1 ? `min(40vw, calc(58svh * ${mainA.toFixed(3)}))` : `min(30vw, calc(64svh * ${mainA.toFixed(3)}))`;
  const sideW = mobile
    ? sideA >= 1 ? "44vw" : "32vw"
    : sideA >= 1 ? `min(22vw, calc(34svh * ${sideA.toFixed(3)}))` : `min(15vw, calc(40svh * ${sideA.toFixed(3)}))`;

  return (
    <article className="relative flex h-full w-[88vw] shrink-0 flex-col justify-center gap-7 pt-16 md:w-[76vw] md:flex-row md:items-center md:gap-[5vw] md:pt-0">
      {/* giant drifting chapter number behind everything */}
      <motion.span
        aria-hidden
        style={{ x: numX }}
        className="display pointer-events-none absolute -top-2 right-0 select-none text-[34vw] leading-none text-gold/[0.13] md:top-[6%] md:text-[22vw]"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* photo collage */}
      <div className="relative shrink-0 self-start md:self-auto">
        <Photo src={mainSrc} width={mainW} aspect={mainA} drift={driftMain} />
        {sideSrc && (
          <div className="absolute -bottom-6 -right-10 md:-bottom-10 md:-right-16">
            <Photo src={sideSrc} width={sideW} aspect={sideA} drift={driftSide} delay={0.25} framed />
          </div>
        )}
      </div>

      {/* words */}
      <div className="relative max-w-md md:pl-6">
        <p className="text-[0.66rem] uppercase tracking-[0.42em] text-gold-dark">
          chapter {NUM[index] ?? index + 1}
        </p>
        <RevealText
          as="h3"
          text={title}
          className="display mt-3 text-[2.6rem] italic text-ink md:text-6xl"
          amount={0.6}
        />
        <motion.p
          className="mt-4 text-[0.95rem] leading-relaxed text-stone md:mt-6 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EXPO }}
        >
          {chapter.body}
        </motion.p>
        <motion.p
          className="mt-4 font-serif text-base italic text-gold-dark md:mt-6 md:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.5 }}
        >
          — {chapter.caption}
        </motion.p>
      </div>
    </article>
  );
}

export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distRef = useRef(0);
  const [height, setHeight] = useState<number | null>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const dist = Math.max(0, track.scrollWidth - window.innerWidth);
      distRef.current = dist;
      // vertical scroll needed = horizontal distance to travel (+ one screen)
      setHeight(dist + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distRef.current);
  const total = story.chapters.length;

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-ivory"
      style={{ height: height ?? "420vh" }}
      aria-label="Our story"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* paper texture glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(80% 60% at 20% 30%, #fbf8f2 0%, rgba(251,248,242,0) 70%)" }}
        />
        <motion.div ref={trackRef} style={{ x }} className="relative flex h-full items-center gap-[10vw] pl-[7vw] pr-[12vw] will-change-transform">
          {/* intro */}
          <div className="flex h-full w-[80vw] shrink-0 flex-col justify-center md:w-[44vw]">
            <p className="text-[0.66rem] uppercase tracking-[0.5em] text-gold-dark">{story.eyebrow}</p>
            <RevealText as="h2" text={story.heading} className="display mt-4 text-[5.5rem] leading-[0.85] text-ink md:text-[10rem]" />
            <RevealText
              as="p"
              text={story.intro}
              className="mt-6 font-serif text-2xl italic text-stone md:text-3xl"
              delay={0.3}
            />
            <motion.div
              className="mt-10 flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.4em] text-stone"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              keep scrolling
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                →
              </motion.span>
            </motion.div>
          </div>

          {story.chapters.map((c, i) => (
            <ChapterPanel key={i} chapter={c} index={i} progress={scrollYProgress} total={total} mobile={mobile} />
          ))}

          {/* outro */}
          <div className="flex h-full w-[70vw] shrink-0 flex-col justify-center md:w-[38vw]">
            <RevealText as="p" text={story.outro} className="display text-5xl italic leading-[1.05] text-ink md:text-7xl" />
            <motion.p
              className="mt-8 text-[0.66rem] uppercase tracking-[0.45em] text-gold-dark"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              next chapter ↓
            </motion.p>
          </div>
        </motion.div>

        {/* reel progress */}
        <div className="absolute bottom-7 left-1/2 h-px w-36 -translate-x-1/2 bg-ink/10 md:w-56">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-gold-dark" />
        </div>
      </div>
    </section>
  );
}
