"use client";

import { useEffect, useState } from "react";

/**
 * True while the strip of screen where the floating nav sits (about 5% from
 * the top) is over an element marked `data-nav-dark`, so the nav can switch
 * to its night styling instead of turning a muddy grey.
 *
 * An IntersectionObserver reports only the moments that changes — no
 * measuring the page on every scroll frame. Marked elements must be on the
 * page when the nav mounts (they are: nav and sections render together).
 */
export function useOverDark() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const over = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) over.add(e.target);
          else over.delete(e.target);
        }
        setDark(over.size > 0);
      },
      // shrink the viewport to a thin band 5–6% from the top
      { rootMargin: "-5% 0px -94% 0px" }
    );
    document.querySelectorAll("[data-nav-dark]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return dark;
}
