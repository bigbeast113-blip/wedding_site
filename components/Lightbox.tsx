"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDialog } from "@/lib/useDialog";

const LightboxContext = createContext<(src: string) => void>(() => {});

/** Call this in any client component to open an image full-screen. */
export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  useDialog(!!src, () => setSrc(null));

  return (
    <LightboxContext.Provider value={setSrc}>
      {children}

      <AnimatePresence>
        {src && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo"
            className="fixed inset-0 z-[110] flex items-center justify-center overscroll-contain bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSrc(null)}
          >
            <motion.img
              src={src}
              alt=""
              className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.82, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSrc(null)}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
