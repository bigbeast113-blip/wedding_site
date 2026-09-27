"use client";

import { motion } from "framer-motion";
import { decoTrees } from "@/content/wedding";
import { galleryPhotos, guestbookZip } from "@/content/guestbook";
import { usePageTransition } from "@/components/PageTransition";
import { useLightbox } from "@/components/Lightbox";
import DecoTree from "@/components/DecoTree";
import Sparkles from "@/components/Sparkles";
import { SubNav, SubHero } from "@/components/SubPage";
import { DownloadIcon } from "@/components/Icons";

// A gentle scatter of tilts so the grid feels like prints laid on a table.
const ROT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "rotate-1", "-rotate-1"];

export default function EngagementPage() {
  const go = usePageTransition();
  const openLightbox = useLightbox();

  return (
    <main className="relative min-h-screen bg-ivory">
      <SubNav />
      <SubHero
        eyebrow="the engagement"
        title="engagement photos"
        intro={`${galleryPhotos.length} of our favorite moments — tap any photo to see it up close.`}
      >
        <a
          href={guestbookZip}
          download
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-light px-7 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-night shadow-[0_10px_40px_rgba(230,205,157,0.3)] transition-colors hover:bg-white"
        >
          <DownloadIcon className="h-4 w-4" />
          Download all photos
        </a>
      </SubHero>

      <section className="relative overflow-hidden px-4 pb-28 pt-6 sm:px-6">
        <Sparkles count={16} />
        <DecoTree src={decoTrees.pineA} side="left" width="clamp(90px, 11vw, 175px)" opacity={0.4} />
        <DecoTree src={decoTrees.pineB} side="right" width="clamp(100px, 12vw, 185px)" opacity={0.4} />

        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5">
          {galleryPhotos.map((src, i) => (
            <motion.button
              key={src}
              onClick={() => openLightbox(src, galleryPhotos)}
              aria-label={`View engagement photo ${i + 1} of ${galleryPhotos.length}`}
              data-cursor="view"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.9, delay: (i % 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group block"
            >
              <span
                className={`block bg-white p-2 pb-5 shadow-[0_10px_24px_rgba(20,30,40,0.16)] transition-all duration-500 ease-expo group-hover:z-10 group-hover:rotate-0 group-hover:scale-[1.06] group-hover:shadow-[0_22px_40px_rgba(20,30,40,0.25)] ${
                  ROT[i % ROT.length]
                }`}
              >
                <span className="block overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-110"
                  />
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        <div className="relative mt-20 text-center">
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
