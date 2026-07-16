"use client";

import { useEffect, useRef } from "react";

/**
 * Shared overlay behavior for modals/lightboxes:
 *   • locks background scroll while open (prevents mobile scroll-bleed)
 *   • closes on the Escape key
 *
 * `onClose` is read through a ref so callers can pass an inline function
 * without churning the effect. Pair this with `overscroll-contain` on any
 * scrollable overlay and `role="dialog" aria-modal="true"` on the panel.
 */
export function useDialog(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);
}
