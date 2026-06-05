"use client";

import { motion } from "framer-motion";
import { nav, couple } from "@/content/wedding";
import { usePageTransition } from "./PageTransition";

export default function Nav({ onRsvp }: { onRsvp: () => void }) {
  const go = usePageTransition();
  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <nav className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-black/5 bg-paper/80 px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <a href="#top" className="font-serif text-xl font-semibold tracking-tight text-ink">
          {couple.monogram}
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-stone transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => go("/wedding-party")}
            className="text-sm text-stone transition-colors hover:text-ink"
          >
            Wedding Party
          </button>
        </div>

        <button
          onClick={onRsvp}
          className="rounded-full bg-rust px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
        >
          {nav.cta}
        </button>
      </nav>
    </motion.header>
  );
}
