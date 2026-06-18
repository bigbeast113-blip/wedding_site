"use client";

import { motion } from "framer-motion";
import { couple, decoTrees } from "@/content/wedding";
import { galleryPhotos, guestbookZip } from "@/content/guestbook";
import { usePageTransition } from "@/components/PageTransition";
import { useLightbox } from "@/components/Lightbox";
import DecoTree from "@/components/DecoTree";

const ROT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "rotate-1", "-rotate-1"];

export default function EngagementPage() {
  const go = usePageTransition();
  const openLightbox = useLightbox();

  return (
    <main className="relative min-h-screen pb-28">
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

      <section className="section-frost relative px-5 pt-36 sm:px-6">
        <DecoTree src={decoTrees.pineA} side="left" width="clamp(90px, 11vw, 175px)" opacity={0.4} />
        <DecoTree src={decoTrees.pineB} side="right" width="clamp(100px, 12vw, 185px)" opacity={0.4} />

        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="display text-6xl text-ink sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            engagement
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-stone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            {galleryPhotos.length} of our favorite moments.
          </motion.p>
          <motion.a
            href={guestbookZip}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-rust-dark"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            ⬇ Download all photos
          </motion.a>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5">
          {galleryPhotos.map((src, i) => (
            <button
              key={src}
              onClick={() => openLightbox(src)}
              className={`group block bg-white p-2 pb-5 shadow-[0_8px_18px_rgba(20,30,40,0.18)] transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.05] ${ROT[i % ROT.length]}`}
            >
              <div className="overflow-hidden">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
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
