"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";

/** The site's signature easing — a quick start with a long, graceful settle. */
export const EXPO = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { y: "115%" },
  show: (c: { delay: number; duration: number }) => ({
    y: "0%",
    transition: { delay: c.delay, duration: c.duration, ease: EXPO },
  }),
};

/**
 * Masked text reveal: every word (or letter) slides up from behind an
 * invisible clipping edge, staggered — the classic editorial "type rises into
 * place" effect. Words keep their natural line-wrapping, even in letter mode.
 *
 *   <RevealText as="h2" text="our story" className="display text-7xl" />
 *   <RevealText text="Jesse & Francesca" by="char" trigger="mount" delay={1} />
 */
export default function RevealText({
  text,
  as: Tag = "span",
  className = "",
  by = "word",
  delay = 0,
  stagger,
  duration = 1.05,
  trigger = "inView",
  amount = 0.5,
  once = true,
  tokenClass,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  duration?: number;
  trigger?: "inView" | "mount";
  amount?: number;
  once?: boolean;
  /** Optional extra classes for a specific word (e.g. a gold italic "&"). */
  tokenClass?: (word: string, index: number) => string | undefined;
}) {
  const step = stagger ?? (by === "char" ? 0.04 : 0.075);
  const words = text.split(" ");
  let n = 0; // running token index for the stagger

  const mask = (content: string, key: string, extra = "") => {
    const c = { delay: delay + n++ * step, duration };
    return (
      <span
        key={key}
        className="inline-block overflow-hidden align-bottom"
        style={{ paddingBottom: "0.14em", marginBottom: "-0.14em", paddingRight: "0.05em", marginRight: "-0.05em" }}
      >
        <motion.span className={`inline-block ${extra}`} variants={item} custom={c}>
          {content}
        </motion.span>
      </span>
    );
  };

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden", animate: "show" }
      : { initial: "hidden", whileInView: "show", viewport: { once, amount } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span aria-hidden className="inline" {...triggerProps}>
        {words.map((word, wi) => {
          const extra = tokenClass?.(word, wi) ?? "";
          const node =
            by === "char" ? (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => mask(ch, `${wi}-${ci}`, extra))}
              </span>
            ) : (
              mask(word, `${wi}`, extra)
            );
          return (
            <span key={`w${wi}`}>
              {node}
              {wi < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
