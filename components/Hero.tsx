"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero, couple } from "@/content/wedding";
import RevealText, { EXPO } from "./motion/RevealText";

/**
 * The landing view after the portal. The background is the same image the
 * splash reveals (same scale, same crop) so the hand-off is invisible. Then:
 * names rise in letter by letter, gold rules draw outward, and as you scroll
 * away the scene deepens and darkens into the night sky of the next section.
 */
export default function Hero({ returning = false }: { returning?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Wait for the splash to finish fading (unless we came back from a sub-page).
  const t0 = returning ? 0.15 : 1.0;

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const nightfall = useTransform(scrollYProgress, [0, 0.9], [0, 0.85]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-svh w-full overflow-hidden bg-night">
      {/* Responsive background — must match the splash (wide desktop / tall mobile). */}
      <motion.img
        src={hero.image}
        alt="Jesse proposing to Francesca on a snowy mountaintop at sunset"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 hidden h-full w-full object-cover will-change-transform sm:block"
      />
      <motion.img
        src={hero.imageTall}
        alt="Jesse proposing to Francesca on a snowy mountaintop at sunset"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform sm:hidden"
      />

      {/* scrims: sky legibility up top, a soft floor at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,14,22,0.6) 0%, rgba(8,14,22,0.18) 60%, rgba(8,14,22,0) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
      {/* scroll-driven dusk -> night, so the next (night) section flows on */}
      <motion.div className="pointer-events-none absolute inset-0 bg-night" style={{ opacity: nightfall }} />

      <motion.div
        style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
        className="absolute inset-x-0 top-[14vh] flex flex-col items-center px-6 text-center text-white sm:top-[15vh]"
      >
        <motion.span
          className="mb-4 text-[0.7rem] uppercase tracking-[0.55em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-xs"
          initial={{ opacity: 0, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, letterSpacing: "0.55em" }}
          transition={{ delay: t0 - 0.1, duration: 1.8, ease: EXPO }}
        >
          {hero.eyebrow}
        </motion.span>

        <RevealText
          as="h1"
          text={couple.names}
          by="char"
          trigger="mount"
          delay={t0}
          stagger={0.045}
          duration={1.25}
          className="display text-[3.4rem] italic leading-[0.95] text-white drop-shadow-[0_3px_24px_rgba(0,0,0,0.55)] sm:text-8xl lg:text-9xl"
          tokenClass={(w) => (w === "&" ? "text-gold-grad px-[0.06em]" : undefined)}
        />

        <div className="mt-6 flex items-center gap-4">
          <motion.span
            className="h-px w-12 origin-right bg-gradient-to-l from-gold-light to-transparent sm:w-20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: t0 + 0.9, duration: 1.4, ease: EXPO }}
          />
          <motion.span
            className="text-xs uppercase tracking-[0.38em] text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t0 + 0.8, duration: 1.2, ease: EXPO }}
          >
            {couple.dateDisplay}
          </motion.span>
          <motion.span
            className="h-px w-12 origin-left bg-gradient-to-r from-gold-light to-transparent sm:w-20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: t0 + 0.9, duration: 1.4, ease: EXPO }}
          />
        </div>
        <motion.p
          className="mt-3 text-[0.62rem] uppercase tracking-[0.34em] text-white/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0 + 1.2, duration: 1.4 }}
        >
          {couple.venue} · {couple.city}
        </motion.p>
      </motion.div>

      {/* scroll cue: a gold bead gliding down a thin line */}
      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center"
      >
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t0 + 1.6, duration: 1.2 }}
        >
          <span className="text-[0.62rem] uppercase tracking-[0.5em] text-white/75">{hero.scrollHint}</span>
          <span className="relative mt-3 block h-12 w-px overflow-hidden bg-white/25">
            <motion.span
              className="absolute left-0 top-0 block h-4 w-px bg-gold-light"
              animate={{ y: ["-100%", "320%"] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
