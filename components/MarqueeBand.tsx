"use client";

import { marquee } from "@/content/wedding";
import Marquee from "./motion/Marquee";
import Snowdrift from "./Snowdrift";

const Star = () => <span className="mx-6 inline-block text-[0.35em] text-gold md:mx-10">✦</span>;

/** Two opposing bands of oversized type that speed up with your scrolling. */
export default function MarqueeBand() {
  return (
    <section aria-hidden data-nav-dark className="relative overflow-hidden border-t border-white/5 bg-night pb-24 pt-10 sm:pb-32 md:pb-40 md:pt-14">
      <Marquee baseVelocity={-1.4}>
        {marquee.map((t) => (
          <span key={t} className="display inline-flex items-center text-[16vw] leading-[1.05] text-gold-light/80 md:text-[9.5vw]">
            <span className="text-outline">{t}</span>
            <Star />
          </span>
        ))}
      </Marquee>
      <Marquee baseVelocity={1.1} className="-mt-1">
        {marquee.map((t) => (
          <span key={t} className="display inline-flex items-center text-[8vw] italic leading-[1.1] text-ivory/80 md:text-[4.6vw]">
            {t}
            <Star />
          </span>
        ))}
      </Marquee>
      <Snowdrift />
    </section>
  );
}
