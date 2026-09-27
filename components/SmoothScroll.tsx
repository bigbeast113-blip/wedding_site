"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, restoreHomeSpot, saveHomeSpot, setLenis } from "@/lib/scroll";

// layout effect in the browser (runs before paint); plain effect on the server
const useBeforePaint = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Buttery momentum scrolling for the whole site (desktop wheel/trackpad).
 * Touch devices keep their native scrolling, and anyone with "reduce motion"
 * turned on gets plain native scroll. Framer Motion's scroll-linked effects
 * read the real window scroll position, so they work unchanged on top of it.
 *
 * Also remembers your place on the home page: pop over to the wedding party
 * or the photos and "Back to the wedding" (or the browser's back button)
 * returns you to the exact spot you left, not the top.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // we restore positions ourselves — stop the browser fighting over it
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      // snappier catch-up: fast wheel scrolling no longer trails behind your hand
      lerp: 0.12,
      wheelMultiplier: 1,
      anchors: { offset: -90 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New page -> start at the top without any glide; back home -> your spot.
  // (Before paint, so the top of the page never flashes on the way back.)
  useBeforePaint(() => {
    if (pathname === "/") {
      const undo = restoreHomeSpot();
      if (undo) return undo;
    }
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  // Keep the home-page spot fresh while reading (once scrolling settles).
  useEffect(() => {
    if (pathname !== "/") return;
    let t = 0;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => saveHomeSpot(), 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
