"use client";

import { motion } from "framer-motion";
import { story, Chapter, decoTrees } from "@/content/wedding";
import DecoTree from "./DecoTree";
import { useLightbox } from "./Lightbox";

function PolaroidStack({ photos, caption }: { photos: string[]; caption: string }) {
  const openLightbox = useLightbox();
  const mid = (photos.length - 1) / 2;
  return (
    <div className="relative mx-auto h-[270px] w-[250px] sm:h-[430px] sm:w-[370px]">
      {photos.map((src, i) => {
        // Symmetric fan, centered on the container (the -50% keeps it centered
        // even though Framer controls the transform).
        const rot = (i - mid) * 7;
        const tx = (i - mid) * 18;
        const ty = (i - mid) * 10;
        return (
          // Outer wrapper centers the photo (plain CSS). Inner motion element
          // handles the fan animation — keeps centering and animation separate
          // so Framer's transform can't undo the centering.
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: photos.length - i }}
          >
            <motion.div
              role="button"
              tabIndex={0}
              aria-label="View photo full screen"
              onClick={() => openLightbox(src)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(src);
                }
              }}
              className="cursor-pointer rounded-sm bg-white p-2.5 pb-8 shadow-xl sm:p-3 sm:pb-10"
              initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
              whileInView={{ rotate: rot, x: tx, y: ty, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            >
              <img
                src={src}
                alt=""
                className="h-[180px] w-[180px] object-cover sm:h-[320px] sm:w-[320px]"
              />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-0 right-0 text-center font-serif text-sm italic text-stone sm:bottom-2 sm:text-base">
                  {caption}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function ChapterRow({ chapter, index }: { chapter: Chapter; index: number }) {
  const textFirst = index % 2 === 0;

  const text = (
    <motion.div
      className={`max-w-sm text-center ${textFirst ? "md:text-right" : "md:text-left"}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="font-sans text-sm font-medium uppercase tracking-wide text-ink">
        {chapter.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-stone">{chapter.body}</p>
    </motion.div>
  );

  const stack = <PolaroidStack photos={chapter.photos} caption={chapter.caption} />;

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-12 md:min-h-[80vh] md:flex-row md:gap-20 md:py-16">
      {textFirst ? (
        <>
          {text}
          {stack}
        </>
      ) : (
        <>
          {stack}
          {text}
        </>
      )}
    </div>
  );
}

export default function Story() {
  return (
    <section id="story" className="section-frost relative px-6 pb-20 pt-8 md:pb-24 md:pt-0">
      <DecoTree src={decoTrees.pineA} side="left" width="clamp(90px, 13vw, 210px)" opacity={0.5} />


      {/* Heading: static on mobile (so scrolling chapters can't cover it),
          sticky overlay only on desktop. */}
      <div className="relative z-0 flex justify-center md:sticky md:top-0 md:pt-28">
        <h2 className="display text-5xl text-ink sm:text-7xl md:text-8xl lg:text-9xl">
          {story.heading}
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-5xl md:-mt-16">
        {story.chapters.map((chapter, i) => (
          <ChapterRow key={i} chapter={chapter} index={i} />
        ))}
      </div>
    </section>
  );
}
