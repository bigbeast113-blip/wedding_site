import type Lenis from "lenis";

/**
 * Tiny global handle on the page's smooth-scroll (Lenis) instance, plus a
 * counted scroll lock. The splash gate and every modal call lockScroll() /
 * unlockScroll(); the page only scrolls again once *all* locks are released,
 * so overlapping locks can't accidentally re-enable scrolling behind a modal.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  locks += 1;
  document.documentElement.classList.add("scroll-locked");
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.classList.remove("scroll-locked");
    lenis?.start();
  }
}
