"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { closing, couple, rsvp } from "@/content/wedding";
import NightSky from "./motion/NightSky";
import { EXPO } from "./motion/RevealText";
import Snowdrift from "./Snowdrift";

/**
 * The finale: a small framed photo in the night sky that — as you scroll —
 * unfolds to fill the entire screen, then the closing line and RSVP rise
 * over it. (Pinned + scroll-linked, so it rewinds if you scroll back up.)
 */
export default function Closing({ onRsvp }: { onRsvp: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.55],
    mobile
      ? ["inset(22% 12% 22% 12% round 22px)", "inset(0% 0% 0% 0% round 0px)"]
      : ["inset(21% 31% 21% 31% round 28px)", "inset(0% 0% 0% 0% round 0px)"]
  );
  const imgScale = useTransform(scrollYProgress, [0, 0.6], [1.35, 1]);
  const dim = useTransform(scrollYProgress, [0.35, 0.62], [0.05, 0.5]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.22], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.72], [50, 0]);

  return (
    <section id="closing" ref={ref} data-nav-dark className="relative h-[250vh] bg-night">
      <Snowdrift edge="top" />
      <div className="sticky top-0 h-svh overflow-hidden">
        <NightSky stars={70} />

        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-x-0 top-[9%] z-10 px-6 text-center">
          <p className="text-[0.68rem] uppercase tracking-[0.5em] text-gold-light sm:text-xs">{closing.eyebrow}</p>
        </motion.div>

        <motion.div style={{ clipPath }} className="absolute inset-0 will-change-[clip-path]">
          <motion.img
            src={mobile ? closing.imageTall : closing.image}
            alt="Jesse and Francesca with their dogs"
            style={{ scale: imgScale }}
            className="h-full w-full object-cover will-change-transform"
          />
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-night" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="display max-w-4xl text-[2.3rem] italic leading-[1.1] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:text-5xl md:text-7xl">
            {closing.line}
          </p>

          {rsvp.enabled ? (
            <motion.button
              onClick={onRsvp}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: EXPO }}
              className="mt-12 rounded-full bg-gold-light px-9 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-night shadow-[0_10px_40px_rgba(230,205,157,0.35)] transition-colors hover:bg-white"
            >
              Submit RSVP
            </motion.button>
          ) : (
            <button
              disabled
              title="RSVP opens closer to the date"
              className="mt-12 cursor-not-allowed rounded-full border border-white/25 bg-white/10 px-9 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-white/65 md:backdrop-blur-sm"
            >
              RSVP · Coming Soon
            </button>
          )}

          <p className="mt-10 text-[0.64rem] uppercase tracking-[0.4em] text-white/70">
            {couple.names} · {couple.dateDisplay}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
