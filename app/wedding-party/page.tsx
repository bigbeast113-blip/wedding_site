"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { weddingParty, decoTrees, PartyMember } from "@/content/wedding";
import { usePageTransition } from "@/components/PageTransition";
import { useLightbox } from "@/components/Lightbox";
import DecoTree from "@/components/DecoTree";
import Sparkles from "@/components/Sparkles";
import { SubNav, SubHero } from "@/components/SubPage";
import RevealText from "@/components/motion/RevealText";

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
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        onClick={() => src && full && openLightbox(full)}
        onKeyDown={(e) => {
          if (src && full && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openLightbox(full);
          }
        }}
        role={src ? "button" : undefined}
        tabIndex={src ? 0 : undefined}
        aria-label={src ? `View ${m.name}'s photo` : undefined}
        data-cursor={src ? "view" : undefined}
        className={`group relative h-32 w-32 overflow-hidden rounded-full border-[3px] border-white shadow-[0_18px_40px_rgba(28,26,23,0.18)] ring-1 ring-gold/30 transition-all duration-700 ease-expo sm:h-36 sm:w-36 ${
          src ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,26,23,0.25)] hover:ring-4 hover:ring-gold/40" : ""
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={m.name}
            onError={() => setIdx((n) => n + 1)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-110"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-serif text-4xl text-stone"
            style={{ background: "linear-gradient(135deg,#f3ead9,#e2d2b3)" }}
          >
            {initials(m.name)}
          </div>
        )}
      </div>
      <h3 className="mt-4 font-serif text-2xl text-ink">{m.name}</h3>
      {m.role && (
        <p className="mt-1 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-gold-dark">
          {m.role}
        </p>
      )}
    </motion.div>
  );
}

export default function WeddingPartyPage() {
  const go = usePageTransition();

  return (
    <main className="relative min-h-screen bg-ivory">
      <SubNav />
      <SubHero eyebrow="our favorite people" title={weddingParty.heading} intro={weddingParty.intro} />

      <section className="relative overflow-hidden px-6 pb-28 pt-8">
        <Sparkles count={16} />
        <DecoTree src={decoTrees.pineA} side="left" width="clamp(100px, 12vw, 190px)" opacity={0.45} />
        <DecoTree src={decoTrees.pineB} side="right" width="clamp(110px, 13vw, 200px)" opacity={0.45} />

        <div className="relative mx-auto max-w-5xl space-y-24">
          {weddingParty.groups.map((group) => (
            <div key={group.title}>
              <div className="mb-12 flex flex-col items-center text-center">
                <span className="mb-3 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <RevealText as="h2" text={group.title} className="display text-5xl text-ink sm:text-6xl" />
              </div>
              <div className="mx-auto grid max-w-4xl grid-cols-2 justify-items-center gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4">
                {group.members.map((m, i) => (
                  <MemberCard key={m.name} m={m} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-24 text-center">
          <button
            onClick={() => go("/")}
            className="rounded-full border border-gold-dark px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-gold-dark transition-colors duration-500 hover:bg-night hover:text-ivory"
          >
            ← Back to the wedding
          </button>
        </div>
      </section>
    </main>
  );
}
