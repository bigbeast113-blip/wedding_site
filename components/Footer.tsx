"use client";

import { couple, footer, nav } from "@/content/wedding";
import { getLenis } from "@/lib/scroll";
import NightSky from "./motion/NightSky";
import RevealText from "./motion/RevealText";
import { usePageTransition } from "./PageTransition";

export default function Footer() {
  const go = usePageTransition();
  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer data-nav-dark className="relative overflow-hidden bg-night px-6 pb-12 pt-24 text-center text-ivory md:pt-32">
      <NightSky stars={45} glow={false} />
      <div className="relative z-10 mx-auto max-w-5xl">
        <RevealText
          as="p"
          text={couple.monogram}
          duration={1.4}
          className="display text-[34vw] leading-[0.85] md:text-[15rem]"
          tokenClass={() => "text-gold-grad text-gold-shimmer"}
        />
        <p className="mt-6 text-[0.7rem] uppercase tracking-[0.45em] text-ivory/75">
          {couple.names} · {couple.dateDisplay}
        </p>
        <p className="mt-2 text-[0.64rem] uppercase tracking-[0.38em] text-ivory/45">
          {couple.venue} · {couple.city}
        </p>

        <nav className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ivory/65" aria-label="Footer">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-gold-light">
              {l.label}
            </a>
          ))}
          <button onClick={() => go("/wedding-party")} className="transition-colors hover:text-gold-light">
            Wedding Party
          </button>
          <button onClick={() => go("/engagement")} className="transition-colors hover:text-gold-light">
            Engagement Photos
          </button>
        </nav>

        <button
          onClick={toTop}
          className="group mx-auto mt-12 flex flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.4em] text-ivory/60 transition-colors hover:text-gold-light"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-base transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold-light">
            ↑
          </span>
          back to the top
        </button>

        <p className="mt-14 font-serif text-lg italic text-ivory/45">{footer.note}</p>
      </div>
    </footer>
  );
}
