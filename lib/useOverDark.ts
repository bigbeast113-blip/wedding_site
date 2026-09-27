"use client";

import { useEffect, useState } from "react";

/**
 * True while a horizontal line `probe` px from the top of the viewport (the
 * middle of the floating nav) sits over an element marked `data-nav-dark`, so
 * the nav can switch to its night styling instead of turning a muddy grey.
 */
export function useOverDark(probe = 44) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      let over = false;
      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) over = true;
      });
      setDark(over);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [probe]);

  return dark;
}
