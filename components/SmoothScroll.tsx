"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/scroll";

/**
 * Buttery momentum scrolling for the whole site (desktop wheel/trackpad).
 * Touch devices keep their native scrolling, and anyone with "reduce motion"
 * turned on gets plain native scroll. Framer Motion's scroll-linked effects
 * read the real window scroll position, so they work unchanged on top of it.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.085,
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

  // New page -> start at the top without any glide.
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
