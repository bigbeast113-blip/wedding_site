"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faq, decoTrees } from "@/content/wedding";
import DecoTree from "./DecoTree";
import Sparkles from "./Sparkles";
import RevealText, { EXPO } from "./motion/RevealText";

function Item({
  num,
  q,
  a,
  open,
  onToggle,
}: {
  num: number;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="border-b border-ink/10"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: (num % 4) * 0.05, ease: EXPO }}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center gap-5 py-6 text-left md:gap-7"
      >
        <span className="w-7 shrink-0 font-serif text-sm text-gold-dark" style={{ fontVariantNumeric: "lining-nums" }}>
          {String(num).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 font-serif text-xl leading-snug transition-colors duration-500 md:text-2xl ${
            open ? "text-gold-dark" : "text-ink group-hover:text-gold-dark"
          }`}
        >
          {q}
        </span>
        <span
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
            open ? "border-gold bg-gold text-night" : "border-ink/15 text-stone group-hover:border-gold"
          }`}
        >
          <motion.span
            className="absolute h-px w-3.5 bg-current"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.5, ease: EXPO }}
          />
          <motion.span
            className="absolute h-3.5 w-px bg-current"
            animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
            transition={{ duration: 0.5, ease: EXPO }}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EXPO }}
            className="overflow-hidden"
          >
            <p className="pb-7 pl-12 pr-10 leading-relaxed text-stone md:pl-14 md:text-lg">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-ivory px-6 py-28 md:py-40">
      <Sparkles count={14} />
      <DecoTree src={decoTrees.frost} side="left" width="clamp(115px, 14vw, 210px)" opacity={0.5} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[0.95fr_1.5fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="text-[0.66rem] uppercase tracking-[0.5em] text-gold-dark">{faq.eyebrow}</p>
          <RevealText as="h2" text={faq.heading} className="display mt-4 text-6xl text-ink md:text-7xl" />
          <p className="mt-8 text-stone">{faq.helpLead}</p>
          <a
            href={faq.helpLinkHref}
            className="group relative mt-1 inline-block font-serif text-xl italic text-ink"
          >
            {faq.helpLinkLabel}
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ease-expo group-hover:scale-x-100 md:scale-x-50" />
          </a>
        </div>

        <div className="border-t border-ink/10">
          {faq.items.map((item, i) => (
            <Item
              key={i}
              num={i + 1}
              q={item.q}
              a={item.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
