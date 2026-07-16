"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { details, DetailCard } from "@/content/wedding";
import Blizzard from "./Blizzard";
import { usePageTransition } from "./PageTransition";
import { useLightbox } from "./Lightbox";
import { useDialog } from "@/lib/useDialog";

function Card({ card, onOpen }: { card: DetailCard; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      className="group relative h-56 overflow-hidden rounded-2xl text-left shadow-md"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      <img
        src={card.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-white">{card.title}</h3>
          <p className="mt-1 max-w-[80%] text-sm text-white/80">{card.blurb}</p>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/90 text-xl text-ink transition-colors group-hover:bg-rust group-hover:text-white">
          +
        </span>
      </div>
    </motion.button>
  );
}

function Modal({ card, onClose }: { card: DetailCard; onClose: () => void }) {
  const openLightbox = useLightbox();
  useDialog(true, onClose); // lock scroll + Escape while the modal is mounted
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/40 p-4 backdrop-blur-sm sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        className="relative w-full max-w-2xl rounded-2xl bg-paper p-6 shadow-2xl sm:p-10"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl text-stone transition-colors hover:bg-black/5 hover:text-ink"
          aria-label="Close"
        >
          ×
        </button>

        <img
          src={card.image}
          alt=""
          className="mb-6 h-56 w-full rounded-xl object-cover"
        />

        <h2 className="font-serif text-4xl font-semibold text-ink">{card.title}</h2>
        <p className="mt-3 leading-relaxed text-stone">{card.modal.intro}</p>

        {card.modal.gallery &&
          (card.modal.gallery.length ? (
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {card.modal.gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => openLightbox(src)}
                  aria-label={`View photo ${i + 1} full screen`}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-cream px-4 py-8 text-center text-sm text-stone">
              Our engagement photos will live here soon — check back closer to the day. 📸
            </p>
          ))}

        {card.modal.sections?.map((s) => (
          <div key={s.heading} className="mt-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-rust-dark">{s.heading}</h4>
            <ul className="mt-3 space-y-3">
              {s.items.map((it) => (
                <li key={it.name}>
                  <p className="font-serif text-lg text-ink">{it.name}</p>
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
                className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white/60 p-3 transition-colors hover:border-rust hover:bg-white"
              >
                {h.image ? (
                  <img
                    src={h.image}
                    alt={h.name}
                    className="h-20 w-28 flex-none rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-28 flex-none items-center justify-center rounded-lg bg-cream font-serif text-3xl text-stone">
                    ⛄
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-serif text-lg text-ink">{h.name}</p>
                  <p className="text-sm text-stone">{h.desc}</p>
                  <span className="mt-1 inline-block text-xs font-medium uppercase tracking-wide text-rust-dark">
                    Book a room →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {card.modal.links && (
          <div className="mt-6 flex flex-wrap gap-3">
            {card.modal.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-rust px-5 py-2 text-sm text-rust-dark transition-colors hover:bg-rust hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Details() {
  const [active, setActive] = useState<DetailCard | null>(null);
  const go = usePageTransition();

  return (
    <section id="details" className="section-frost relative px-6 py-24">
      <Blizzard direction="right" tone="frost" />
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          className="display text-4xl text-ink sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {details.heading}
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-stone">{details.subheading}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {details.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onOpen={() => {
              if (card.id === "wedding-parties") go("/wedding-party");
              else if (card.id === "gallery") go("/engagement");
              else setActive(card);
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && <Modal card={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
