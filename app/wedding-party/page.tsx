"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { weddingParty, couple, decoTrees, PartyMember } from "@/content/wedding";
import { usePageTransition } from "@/components/PageTransition";
import { useLightbox } from "@/components/Lightbox";
import DecoTree from "@/components/DecoTree";

// Avatars are discovered by name (case-insensitive): drop "<Name>.jpg/.png/.webp"
// into photos/weddingparty/, run _optimize_party.py, and it shows up.
const PARTY_DIR = "/photos/weddingparty";
const EXTS = ["webp", "jpg", "jpeg", "png"];
const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberCard({ m, i }: { m: PartyMember; i: number }) {
  const openLightbox = useLightbox();
  const base = slug(m.name);
  // Try an explicit override first, then the lowercased name with each extension;
  // when all fail, fall back to initials.
  const candidates = [
    ...(m.image ? [m.image] : []),
    ...EXTS.map((ext) => `${PARTY_DIR}/${base}.${ext}`),
  ];
  const [idx, setIdx] = useState(0);
  const src = idx < candidates.length ? candidates[idx] : null;

  // Click opens the full (uncropped) photo: the generated "-full" webp when the
  // avatar is our optimized one, otherwise the same image the avatar uses.
  const full = src === `${PARTY_DIR}/${base}.webp` ? `${PARTY_DIR}/${base}-full.webp` : src;

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
    >
      <div
        onClick={() => src && full && openLightbox(full)}
        className={`relative h-32 w-32 overflow-hidden rounded-full border border-white/70 shadow-lg ring-1 ring-black/5 transition-transform sm:h-36 sm:w-36 ${
          src ? "cursor-pointer hover:scale-105" : ""
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={m.name}
            onError={() => setIdx((n) => n + 1)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-serif text-4xl text-stone"
            style={{ background: "linear-gradient(135deg,#e3ebf1,#c4d3df)" }}
          >
            {initials(m.name)}
          </div>
        )}
      </div>
      <h3 className="mt-4 font-serif text-2xl text-ink">{m.name}</h3>
      {m.role && (
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-rust">
          {m.role}
        </p>
      )}
    </motion.div>
  );
}

export default function WeddingPartyPage() {
  const go = usePageTransition();

  return (
    <main className="relative min-h-screen pb-28">
      {/* nav */}
      <motion.header
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <nav className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-black/5 bg-paper/80 px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <button
            onClick={() => go("/")}
            className="font-serif text-xl font-semibold tracking-tight text-ink"
          >
            {couple.monogram}
          </button>
          <button
            onClick={() => go("/")}
            className="rounded-full bg-rust px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
          >
            ← Back to site
          </button>
        </nav>
      </motion.header>

      <section className="section-frost relative px-6 pt-36">
        <DecoTree src={decoTrees.pineA} side="left" width="clamp(100px, 12vw, 190px)" opacity={0.45} />
        <DecoTree src={decoTrees.pineB} side="right" width="clamp(110px, 13vw, 200px)" opacity={0.45} />

        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="display text-6xl text-ink sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {weddingParty.heading}
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-stone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {weddingParty.intro}
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl space-y-20">
          {weddingParty.groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-10 text-center font-serif text-3xl text-ink sm:text-4xl">
                {group.title}
              </h2>
              <div className="mx-auto grid max-w-4xl grid-cols-2 justify-items-center gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4">
                {group.members.map((m, i) => (
                  <MemberCard key={m.name} m={m} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <button
            onClick={() => go("/")}
            className="rounded-full border border-rust px-7 py-3 text-sm uppercase tracking-[0.2em] text-rust transition-colors hover:bg-rust hover:text-white"
          >
            ← Back to the wedding
          </button>
        </div>
      </section>
    </main>
  );
}
