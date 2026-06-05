"use client";

import { motion } from "framer-motion";
import { story, Chapter, decoTrees } from "@/content/wedding";
import DecoTree from "./DecoTree";
import { useLightbox } from "./Lightbox";

function PolaroidStack({ photos, caption }: { photos: string[]; caption: string }) {
  const openLightbox = useLightbox();
  return (
    <div className="relative mx-auto h-[290px] w-[225px] sm:h-[420px] sm:w-[360px]">
      {photos.map((src, i) => {
        const rot = i === 0 ? -5 : 4 + i * 2;
        const offset = i * 12;
        return (
          <motion.div
            key={i}
            onClick={() => openLightbox(src)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm bg-white p-3 pb-10 shadow-xl"
            style={{ zIndex: photos.length - i }}
            initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
            whileInView={{ rotate: rot, x: offset, y: offset, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
          >
            <img
              src={src}
              alt=""
              className="h-[195px] w-[195px] object-cover sm:h-[320px] sm:w-[320px]"
            />
            {i === 0 && (
              <span className="absolute bottom-2 left-0 right-0 text-center font-serif text-base italic text-stone">
                {caption}
              </span>
            )}
          </motion.div>
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
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-12 py-16 md:flex-row md:gap-20">
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
    <section id="story" className="section-frost relative px-6 pb-24">
      <DecoTree src={decoTrees.pineA} side="left" width="clamp(110px, 13vw, 210px)" opacity={0.5} />
      <div className="sticky top-0 z-0 flex justify-center pt-28">
        <h2 className="display text-5xl text-ink sm:text-7xl md:text-8xl lg:text-9xl">
          {story.heading}
        </h2>
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-5xl">
        {story.chapters.map((chapter, i) => (
          <ChapterRow key={i} chapter={chapter} index={i} />
        ))}
      </div>
    </section>
  );
}
