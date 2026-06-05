"use client";

/**
 * Fixed winter landscape that sits behind the whole page (-z-10). Frosted-glass
 * content sections let it show through as you scroll: a soft snowy sky, layered
 * mountains, and a pine treeline along the horizon.
 */
export default function WinterScene() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,#c9dcea 0%,#dce8f0 30%,#eaf1f5 55%,#f4f8fa 100%)",
      }}
      aria-hidden
    >
      {/* soft sun glow */}
      <div
        className="absolute left-1/2 top-[12%] h-[40vh] w-[40vh] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)" }}
      />

      <svg
        className="absolute bottom-0 left-0 h-[70vh] w-full"
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMax slice"
        style={{ filter: "blur(1.2px)" }}
      >
        {/* far mountains */}
        <path
          d="M0 330 L210 180 L360 300 L560 170 L760 320 L980 190 L1180 310 L1440 200 L1440 620 L0 620 Z"
          fill="#bcccda"
          opacity="0.85"
        />
        {/* snow caps on far range */}
        <path
          d="M560 170 L600 210 L575 218 L545 250 L520 222 L500 235 Z"
          fill="#f4f9fc"
          opacity="0.9"
        />
        <path d="M980 190 L1015 224 L992 230 L965 256 L948 235 Z" fill="#f4f9fc" opacity="0.9" />
        {/* near mountains */}
        <path
          d="M0 420 L260 260 L470 410 L700 280 L940 430 L1180 300 L1440 410 L1440 620 L0 620 Z"
          fill="#a7bccd"
          opacity="0.9"
        />
        <path d="M260 260 L300 300 L276 308 L246 340 L226 312 Z" fill="#fbfdff" opacity="0.95" />
        <path d="M700 280 L742 322 L716 330 L688 360 L666 332 Z" fill="#fbfdff" opacity="0.95" />

        {/* misty band */}
        <rect x="0" y="380" width="1440" height="150" fill="#eef4f8" opacity="0.45" />

        {/* pine treeline */}
        <g fill="#5c7160" opacity="0.92">
          {Array.from({ length: 34 }).map((_, i) => {
            const x = i * 44 + (i % 2) * 8;
            const h = 90 + (i % 5) * 22;
            const w = 30 + (i % 3) * 6;
            const baseY = 620;
            const topY = baseY - h;
            return (
              <polygon
                key={i}
                points={`${x},${baseY} ${x + w / 2},${topY} ${x + w},${baseY}`}
              />
            );
          })}
        </g>
        {/* snow dusting on the treeline tips */}
        <g fill="#eef5fa" opacity="0.55">
          {Array.from({ length: 34 }).map((_, i) => {
            const x = i * 44 + (i % 2) * 8;
            const h = 90 + (i % 5) * 22;
            const w = 30 + (i % 3) * 6;
            const topY = 620 - h;
            return (
              <polygon
                key={i}
                points={`${x + w / 2},${topY} ${x + w / 2 - 7},${topY + 18} ${x + w / 2 + 7},${topY + 18}`}
              />
            );
          })}
        </g>
        {/* snowy ground */}
        <rect x="0" y="600" width="1440" height="20" fill="#f6fafc" />
      </svg>

      {/* drifting fog: soft horizontal mist bands that slowly slide */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-25%] top-[42%] h-[34%] w-[150%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(248,251,253,0.65) 0%, rgba(248,251,253,0) 70%)",
            animation: "fogdrift 42s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-[-25%] top-[60%] h-[40%] w-[150%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 72%)",
            animation: "fogdrift 60s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute left-[-25%] top-[24%] h-[30%] w-[150%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(236,243,248,0.5) 0%, rgba(236,243,248,0) 75%)",
            animation: "fogdrift 52s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
