"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { details, type DetailCard } from "@/content/wedding";
import { usePageTransition } from "./PageTransition";
import { useDialog } from "@/lib/useDialog";
import RevealText, { EXPO } from "./motion/RevealText";
import { PhoneIcon, SnowflakeIcon } from "./Icons";

// Bento placement: the first card is the wide hero tile.
const ORDER = ["travel-logistics", "wedding-parties", "registry", "dinner-menu", "gallery"];
const SIZE: Record<string, string> = {
  "travel-logistics": "md:col-span-2 md:h-[440px]",
  "wedding-parties": "md:col-span-1 md:h-[440px]",
};

function Card({ card, index, onOpen }: { card: DetailCard; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, delay: (index % 3) * 0.1, ease: EXPO }}
      className={`group relative h-[300px] overflow-hidden rounded-2xl text-left shadow-[0_24px_60px_rgba(28,26,23,0.16)] md:h-[330px] ${SIZE[card.id] ?? ""}`}
    >
      <img
        src={card.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-expo group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-night/0 transition-opacity duration-700 group-hover:opacity-95" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition duration-700 group-hover:ring-gold-light/60" />
      {/* light sweep on hover */}
      <div className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-[1200ms] ease-expo group-hover:left-[120%] group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-gold-light">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="display mt-2 text-[2.1rem] text-white md:text-5xl">{card.title}</h3>
        <p className="mt-2 max-w-sm text-sm text-white/75">{card.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.32em] text-white/90">
          explore
          <span className="inline-block transition-transform duration-500 ease-expo group-hover:translate-x-2">→</span>
        </span>
      </div>
    </motion.button>
  );
}

function Modal({ card, onClose }: { card: DetailCard; onClose: () => void }) {
  useDialog(true, onClose); // lock scroll + Escape while the modal is mounted
  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain bg-night/60 p-4 backdrop-blur-md sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-ivory-2 shadow-2xl"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.7, ease: EXPO }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-60 overflow-hidden sm:h-72">
          <motion.img
            src={card.image}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: EXPO }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory-2 via-ivory-2/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-2xl text-ink shadow backdrop-blur transition-colors hover:bg-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="relative px-6 pb-8 sm:px-10 sm:pb-10">
          <h2 className="display -mt-6 text-5xl text-ink">{card.title}</h2>
          <p className="mt-3 leading-relaxed text-stone">{card.modal.intro}</p>

          {card.modal.note && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 flex-none text-gold-dark" />
              <p className="text-sm font-medium leading-relaxed text-gold-dark">{card.modal.note}</p>
            </div>
          )}

          {card.modal.sections?.map((s) => (
            <div key={s.heading} className="mt-7">
              <h4 className="text-[0.66rem] uppercase tracking-[0.35em] text-gold-dark">{s.heading}</h4>
              <ul className="mt-3 space-y-3">
                {s.items.map((it) => (
                  <li key={it.name}>
                    <p className="font-serif text-xl text-ink">{it.name}</p>
                    {it.desc && <p className="text-sm text-stone">{it.desc}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {card.modal.hotels && (
            <div className="mt-6 space-y-4">
              {card.modal.hotels.map((h) => (
                <a
                  key={h.name}
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 p-3 transition-all duration-500 hover:border-gold/60 hover:bg-white hover:shadow-lg"
                >
                  {h.image ? (
                    <img src={h.image} alt={h.name} className="h-20 w-28 flex-none rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-20 w-28 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-ivory-3 to-[#e2d2b3] text-gold-dark">
                      <SnowflakeIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-ink">{h.name}</p>
                    <p className="text-sm text-stone">{h.desc}</p>
                    <span className="mt-1 inline-block text-[0.66rem] font-medium uppercase tracking-[0.25em] text-gold-dark">
                      Hotel details <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {card.modal.links && (
            <div className="mt-7 flex flex-wrap gap-3">
              {card.modal.links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-night px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-gold hover:text-night"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Details() {
  const [active, setActive] = useState<DetailCard | null>(null);
  const go = usePageTransition();
  const cards = [...details.cards].sort(
    (a, b) => (ORDER.indexOf(a.id) + 99) % 99 - (ORDER.indexOf(b.id) + 99) % 99
  );

  return (
    <section id="details" className="relative overflow-hidden bg-ivory px-5 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.5em] text-gold-dark">the details</p>
            <RevealText as="h2" text={details.heading} className="display mt-4 max-w-3xl text-5xl text-ink md:text-7xl" />
          </div>
          <motion.p
            className="max-w-sm text-stone md:text-right"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.3, ease: EXPO }}
          >
            {details.subheading}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
          {cards.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              index={i}
              onOpen={() => {
                if (card.id === "wedding-parties") go("/wedding-party");
                else if (card.id === "gallery") go("/engagement");
                else setActive(card);
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <Modal card={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
