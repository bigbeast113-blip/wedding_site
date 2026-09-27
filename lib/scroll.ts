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

// ── Your place on the home page ───────────────────────────────────────────
// Kept as "section + offset into it" rather than raw pixels, so it still lands
// true if anything above settles to a slightly different height on return.
const ANCHORS = ["top", "story", "date", "countdown", "details", "faq", "closing"];
type Spot = { id: string; delta: number };
let homeSpot: Spot | null = null;
let heldUntil = 0;

/**
 * Remember where the guest is on the home page (no-op anywhere else).
 * `final` = they're leaving right now: that spot wins for a moment, so a late
 * nudge (e.g. the browser scrolling a tapped card fully into view while the
 * page changes) can't overwrite it.
 */
export function saveHomeSpot(final = false) {
  if (!final && performance.now() < heldUntil) return;
  const y = window.scrollY;
  let spot: Spot | null = null;
  for (const id of ANCHORS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + y;
    if (top <= y + 1) spot = { id, delta: y - top };
  }
  if (spot) homeSpot = spot;
  if (final) heldUntil = performance.now() + 2500;
}

/**
 * Put the guest back where they were on the home page. Re-applies for a
 * moment while late layout settles, and lets go as soon as they scroll or
 * tap themselves. Returns a cleanup function (or null if there's no spot).
 */
export function restoreHomeSpot(): (() => void) | null {
  const spot = homeSpot;
  if (!spot || !document.getElementById(spot.id)) return null;
  let stopped = false;
  const jump = () => {
    const el = document.getElementById(spot.id);
    if (stopped || !el) return;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY + spot.delta);
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
  };
  const stop = () => {
    stopped = true;
  };
  const kinds = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  kinds.forEach((k) => window.addEventListener(k, stop, { passive: true, once: true }));
  jump();
  const raf = requestAnimationFrame(jump);
  const timers = [80, 200, 450, 900, 1500].map((ms) => window.setTimeout(jump, ms));
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    kinds.forEach((k) => window.removeEventListener(k, stop));
  };
}
