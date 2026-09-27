"use client";

import { useEffect, useRef } from "react";
import { lockScroll, unlockScroll } from "./scroll";

/**
 * Shared overlay behavior for modals/lightboxes:
 *   • locks background scroll while open (pauses smooth-scroll too, so the
 *     page can't drift behind the modal on wheel or touch)
 *   • closes on the Escape key
 *
 * `onClose` is read through a ref so callers can pass an inline function
 * without churning the effect. Pair this with `data-lenis-prevent` +
 * `overscroll-contain` on any scrollable overlay and `role="dialog"
 * aria-modal="true"` on the panel.
 */
export function useDialog(active: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);
}
