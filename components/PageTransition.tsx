"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "cover" | "reveal";

const Ctx = createContext<(href: string) => void>(() => {});
/** Navigate to `href` with a full-screen blizzard white-out transition. */
export const usePageTransition = () => useContext(Ctx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const go = useCallback(
    (href: string) => {
      if (phase !== "idle" || href === pathname) return;
      target.current = href;
      setPhase("cover");
    },
    [phase, pathname]
  );

  // Dense wind-blown streaks for the blizzard.
  const streaks = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => {
        const top = (i * 41) % 100;
        const len = 40 + (i % 6) * 22;
        const thick = 1.6 + (i % 3) * 1.1;
        const dur = 0.7 + (i % 6) * 0.18;
        const delay = ((i * 17) % 140) / 100;
        const drop = 20 + (i % 5) * 22;
        const op = 0.5 + (i % 5) * 0.1;
        return { top, len, thick, dur, delay, drop, op };
      }),
    []
  );

  function onBloomComplete() {
    if (phase === "cover") {
      if (target.current) router.push(target.current);
      // hold full white a beat so the new page commits behind it, then clear
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("idle");
    }
  }

  return (
    <Ctx.Provider value={go}>
      {children}

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="fixed inset-0 z-[130] overflow-hidden"
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* white-out bloom: builds to full, then clears */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: phase === "cover" ? 0 : 1 }}
              animate={{ opacity: phase === "cover" ? 1 : 0 }}
              transition={{
                duration: 1.15,
                ease: phase === "cover" ? [0.55, 0, 0.9, 0.45] : [0.1, 0.6, 0.3, 1],
              }}
              onAnimationComplete={onBloomComplete}
            />
            {/* driven snow streaks */}
            {streaks.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${s.top}%`,
                  left: "-12vw",
                  width: s.len,
                  height: s.thick,
                  opacity: s.op,
                  filter: "blur(0.6px)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                  animation: `blizzardstreak ${s.dur}s linear ${s.delay}s infinite`,
                  ["--drop" as string]: `${s.drop}px`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
