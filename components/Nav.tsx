"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { nav, couple, rsvp } from "@/content/wedding";
import { usePageTransition } from "./PageTransition";
import { useDialog } from "@/lib/useDialog";
import { getLenis } from "@/lib/scroll";
import { useOverDark } from "@/lib/useOverDark";
import NightSky from "./motion/NightSky";
import { EXPO } from "./motion/RevealText";

function RsvpButton({
  onRsvp,
  dark = false,
  className = "",
}: {
  onRsvp: () => void;
  dark?: boolean;
  className?: string;
}) {
  return rsvp.enabled ? (
    <button
      onClick={onRsvp}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-500 ${
        dark ? "bg-gold-light text-night hover:bg-white" : "bg-night text-ivory hover:bg-gold hover:text-night"
      } ${className}`}
    >
      {nav.cta}
    </button>
  ) : (
    <button
      disabled
      title="RSVP opens closer to the date"
      className={`cursor-not-allowed rounded-full px-5 py-2 text-sm font-medium transition-colors duration-500 ${
        dark ? "bg-white/10 text-ivory/60" : "bg-stone/30 text-white/80"
      } ${className}`}
    >
      RSVP · Coming Soon
    </button>
  );
}

export default function Nav({ onRsvp }: { onRsvp: () => void }) {
  const go = usePageTransition();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  // night styling over the dark sections, ivory glass over the light ones
  const dark = useOverDark();

  // Tuck away while reading downward; slide back the moment you scroll up.
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 220);
    setScrolled(v > 40);
  });

  useDialog(open, () => setOpen(false));

  const jump = (href: string) => {
    setOpen(false);
    // wait for the menu (and its scroll lock) to release, then glide there
    window.setTimeout(() => {
      const l = getLenis();
      if (l) l.scrollTo(href, { offset: -90, duration: 1.6 });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };
  const route = (href: string) => {
    setOpen(false);
    go(href);
  };

  const pages = [
    { label: "Wedding Party", href: "/wedding-party" },
    { label: "Engagement Photos", href: "/engagement" },
  ];

  return (
    <>
      {/* entrance: the banner fades in after the portal reveal */}
      <motion.div
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1.1, ease: EXPO }}
      >
        <motion.header
          className="w-full max-w-5xl"
          animate={{ y: hidden && !open ? "-150%" : "0%" }}
          transition={{ duration: 0.7, ease: EXPO }}
        >
          <nav
            className={`flex items-center justify-between gap-4 rounded-full border px-5 py-2.5 backdrop-blur-md transition-all duration-700 ${
              dark
                ? "border-white/10 bg-night/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                : scrolled
                  ? "border-black/5 bg-ivory-2/90 shadow-[0_10px_40px_rgba(11,20,32,0.12)]"
                  : "border-white/20 bg-ivory-2/75 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            }`}
          >
            <a
              href="#top"
              className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-700 ${
                dark ? "text-gold-light" : "text-ink"
              }`}
            >
              {couple.monogram}
            </a>

            <div className="hidden items-center gap-7 lg:flex">
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`group relative text-sm transition-colors duration-500 ${
                    dark ? "text-ivory/70 hover:text-ivory" : "text-stone hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                </a>
              ))}
              {pages.map((p) => (
                <button
                  key={p.href}
                  onClick={() => go(p.href)}
                  className={`group relative text-sm transition-colors duration-500 ${
                    dark ? "text-ivory/70 hover:text-ivory" : "text-stone hover:text-ink"
                  }`}
                >
                  {p.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <RsvpButton onRsvp={onRsvp} dark={dark} className="hidden sm:inline-block" />
              <button
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
              >
                <span className={`block h-px w-5 transition-colors duration-700 ${dark ? "bg-ivory" : "bg-ink"}`} />
                <span className={`block h-px w-3.5 transition-colors duration-700 ${dark ? "bg-ivory" : "bg-ink"}`} />
              </button>
            </div>
          </nav>
        </motion.header>
      </motion.div>

      {/* full-screen menu for phones & tablets */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col overflow-hidden bg-night text-ivory lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.8, ease: EXPO }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <NightSky stars={50} />
            <div className="relative z-10 flex items-center justify-between px-8 pt-8">
              <span className="font-serif text-2xl text-gold-light">{couple.monogram}</span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <div className="relative z-10 flex flex-1 flex-col justify-center gap-3 px-8">
              {[...nav.links.map((l) => ({ ...l, kind: "anchor" as const })), ...pages.map((p) => ({ ...p, kind: "page" as const }))].map(
                (item, i) => (
                  <motion.button
                    key={item.href}
                    onClick={() => (item.kind === "anchor" ? jump(item.href) : route(item.href))}
                    className="display flex items-baseline gap-4 text-left text-5xl text-ivory transition-colors hover:text-gold-light"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EXPO }}
                  >
                    <span className="w-5 flex-none font-sans text-xs text-gold-light/70">0{i + 1}</span>
                    <span>{item.label}</span>
                  </motion.button>
                )
              )}
            </div>
            <div className="relative z-10 px-8 pb-10">
              <RsvpButton
                onRsvp={() => {
                  setOpen(false);
                  onRsvp();
                }}
                dark
                className="w-full py-3.5"
              />
              <p className="mt-6 text-center text-[0.64rem] uppercase tracking-[0.4em] text-ivory/50">
                {couple.names} · {couple.dateDisplay}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
