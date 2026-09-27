"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { EXPO } from "./RevealText";

const CLOSED = "inset(100% 0% 0% 0%)";
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * A photo that (1) wipes into view from the bottom like a curtain, (2) settles
 * from a slight zoom, and (3) drifts inside its frame as you scroll — the
 * layered "premium image" treatment. Pass `onOpen` to make it open the lightbox.
 *
 * The in-view check watches the (unclipped) outer frame: an element that is
 * itself fully clip-pathed never registers as visible, so it could never reveal.
 */
export default function ParallaxImage({
  src,
  alt = "",
  className = "",
  speed = 0.1,
  reveal = true,
  delay = 0,
  onOpen,
  label = "View photo full screen",
}: {
  src: string;
  alt?: string;
  className?: string;
  speed?: number;
  reveal?: boolean;
  delay?: number;
  onOpen?: () => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  const clickable = !!onOpen;
  const shown = !reveal || inView;

  return (
    <div
      ref={ref}
      className={`relative ${clickable ? "cursor-pointer" : ""} ${className}`}
      onClick={onOpen}
      {...(clickable
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": label,
            "data-cursor": "view",
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen?.();
              }
            },
          }
        : {})}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: reveal ? CLOSED : OPEN }}
        animate={{ clipPath: shown ? OPEN : CLOSED }}
        transition={{ duration: 1.35, delay, ease: EXPO }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reveal ? 1.25 : 1 }}
          animate={{ scale: shown ? 1 : 1.25 }}
          transition={{ duration: 1.8, delay, ease: EXPO }}
        >
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            style={{ y, scale: 1 + speed * 2.4 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
