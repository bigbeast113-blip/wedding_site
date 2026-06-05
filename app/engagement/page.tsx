"use client";

import { motion } from "framer-motion";
import { couple, decoTrees } from "@/content/wedding";
import { guestbook, guestbookZip } from "@/content/guestbook";
import { usePageTransition } from "@/components/PageTransition";
import { useLightbox } from "@/components/Lightbox";
import DecoTree from "@/components/DecoTree";

const ROT = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

/** A photo dressed up as an old camera print: white frame + orange date stamp. */
function Polaroid({
  src,
  stamp,
  i,
  onOpen,
}: {
  src: string;
  stamp: string;
  i: number;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`group relative block bg-white p-2.5 pb-9 shadow-[0_12px_28px_rgba(20,30,40,0.22)] transition-transform duration-300 hover:z-10 hover:scale-[1.04] hover:rotate-0 ${ROT[i % ROT.length]}`}
    >
      <div className="relative overflow-hidden">
        <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />
        {/* vintage orange camera date stamp */}
        {stamp && (
          <span
            className="pointer-events-none absolute bottom-1.5 right-2 font-mono text-[10px] tracking-tight text-orange-400/90 sm:text-xs"
            style={{ textShadow: "0 0 3px rgba(0,0,0,0.55)" }}
          >
            {stamp}
          </span>
        )}
      </div>
      {/* polaroid caption space */}
      <span className="absolute inset-x-0 bottom-2 text-center font-serif text-sm italic text-stone">
        click to view
      </span>
    </button>
  );
}

export default function EngagementPage() {
  const go = usePageTransition();
  const openLightbox = useLightbox();

  const totalPhotos = guestbook.reduce((n, e) => n + e.photos.length, 0);
  const totalVideos = guestbook.reduce((n, e) => n + e.videos.length, 0);

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

      <section className="section-frost relative px-6 pt-36">
        <DecoTree src={decoTrees.pineA} side="left" width="clamp(100px, 12vw, 190px)" opacity={0.4} />
        <DecoTree src={decoTrees.pineB} side="right" width="clamp(110px, 13vw, 200px)" opacity={0.4} />

        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="display text-6xl text-ink sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            engagement party
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-stone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            {totalPhotos} photos &amp; {totalVideos} videos, snapped and shared by everyone who celebrated with us.
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

        <div className="mx-auto mt-16 max-w-5xl space-y-16">
          {guestbook.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink/10 pb-2">
                <h2 className="font-serif text-2xl text-ink sm:text-3xl">{entry.name}</h2>
                {entry.date && (
                  <span className="text-xs uppercase tracking-[0.2em] text-stone">{entry.date}</span>
                )}
              </div>

              {entry.note && (
                <p className="mb-6 max-w-2xl font-serif text-lg italic text-stone">
                  &ldquo;{entry.note}&rdquo;
                </p>
              )}

              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4">
                {entry.photos.map((src, i) => (
                  <Polaroid
                    key={src}
                    src={src}
                    stamp={entry.stamp}
                    i={i}
                    onOpen={() => openLightbox(src)}
                  />
                ))}

                {entry.videos.map((id) => (
                  <div
                    key={id}
                    className="col-span-2 bg-white p-2.5 pb-9 shadow-[0_12px_28px_rgba(20,30,40,0.22)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-black/10">
                      <iframe
                        src={`https://drive.google.com/file/d/${id}/preview`}
                        allow="autoplay"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                    <span className="mt-2 block text-center font-serif text-sm italic text-stone">
                      a little video {entry.stamp ? `· ${entry.stamp}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
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
