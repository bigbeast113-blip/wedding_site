"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faq, decoTrees } from "@/content/wedding";
import DecoTree from "./DecoTree";

function Item({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-ink/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base text-ink sm:text-lg">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="flex-none text-2xl text-stone"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 leading-relaxed text-stone">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-frost relative overflow-hidden px-6 py-24">
      <DecoTree src={decoTrees.frost} side="left" width="clamp(115px, 14vw, 210px)" opacity={0.5} />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="display text-5xl text-ink sm:text-6xl">{faq.heading}</h2>
          <p className="mt-6 text-stone">{faq.helpLead}</p>
          <a
            href={faq.helpLinkHref}
            className="mt-1 inline-block text-stone underline underline-offset-4 transition-colors hover:text-rust"
          >
            {faq.helpLinkLabel}
          </a>
        </div>

        <div>
          {faq.items.map((item, i) => (
            <Item
              key={i}
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
