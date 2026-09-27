"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useDialog } from "@/lib/useDialog";
import { ChevronIcon } from "./Icons";

type Open = (src: string, list?: string[]) => void;
const LightboxContext = createContext<Open>(() => {});

/**
 * Call this in any client component to open an image full-screen. Pass the
 * whole set as `list` and guests can page through it (arrows, keys, swipe).
 */
export const useLightbox = () => useContext(LightboxContext);

type State = { list: string[]; index: number; dir: number };

// dir 0 = just opened (grow in), ±1 = paging (slide in from that side)
const slide: Variants = {
  enter: (dir: number) => (dir === 0 ? { opacity: 0, scale: 0.86, y: 18 } : { opacity: 0, x: dir * 140 }),
  center: { opacity: 1, scale: 1, x: 0, y: 0, transition: { type: "spring", damping: 30, stiffness: 260 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -140, transition: { duration: 0.25 } }),
};

const arrow =
  "absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-gold-light hover:bg-white/20";

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State | null>(null);
  const close = useCallback(() => setState(null), []);
  useDialog(!!state, close);

  const open = useCallback<Open>((src, list) => {
    const l = list && list.includes(src) ? list : [src];
    setState({ list: l, index: l.indexOf(src), dir: 0 });
  }, []);

  const step = useCallback((d: number) => {
    setState((s) => (s && s.list.length > 1 ? { ...s, index: (s.index + d + s.list.length) % s.list.length, dir: d } : s));
  }, []);

  const multi = !!state && state.list.length > 1;

  // arrow keys page through the set
  useEffect(() => {
    if (!multi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [multi, step]);

  // warm up the neighbours so paging is instant
  useEffect(() => {
    if (!state || state.list.length < 2) return;
    const { list, index } = state;
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = list[(index + d + list.length) % list.length];
    });
  }, [state]);

  const src = state ? state.list[state.index] : null;

  return (
    <LightboxContext.Provider value={open}>
      {children}

      <AnimatePresence>
        {state && src && (
          <motion.div
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden overscroll-contain bg-night/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <AnimatePresence initial={false} custom={state.dir} mode="popLayout">
              <motion.img
                key={src}
                src={src}
                alt=""
                custom={state.dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                draggable={false}
                drag={multi ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -500) step(1);
                  else if (info.offset.x > 80 || info.velocity.x > 500) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className={`max-h-[80svh] max-w-[92vw] select-none rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:max-h-[88vh] ${
                  multi ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              />
            </AnimatePresence>

            {multi && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className={`${arrow} bottom-5 left-5 sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2`}
                >
                  <ChevronIcon dir="left" className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className={`${arrow} bottom-5 right-5 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2`}
                >
                  <ChevronIcon className="h-5 w-5" />
                </button>
                <p
                  aria-live="polite"
                  className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 text-[0.66rem] uppercase tracking-[0.4em] text-ivory/60 sm:bottom-6"
                >
                  {state.index + 1} / {state.list.length}
                </p>
              </>
            )}

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
