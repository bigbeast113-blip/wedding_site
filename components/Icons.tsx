// Small line icons (inherit color from `currentColor`) — used instead of emoji,
// which render differently on every phone and clash with the gold palette.
type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PhoneIcon({ className = "" }: P) {
  return (
    <svg {...base} strokeWidth={1.6} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function DownloadIcon({ className = "" }: P) {
  return (
    <svg {...base} strokeWidth={1.8} className={className}>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

export function ChevronIcon({ dir = "right", className = "" }: P & { dir?: "left" | "right" }) {
  return (
    <svg {...base} strokeWidth={1.6} className={className}>
      <path d={dir === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
    </svg>
  );
}

export function SnowflakeIcon({ className = "" }: P) {
  return (
    <svg {...base} strokeWidth={1.3} className={className}>
      <path d="M12 22V2M20.66 17L3.34 7M20.66 7L3.34 17" />
      <path d="M13.84 4.56L12 6.4l-1.84-1.84M6.48 6.69l.67 2.51-2.51.67M4.64 14.13l2.51.67-.67 2.51M10.16 19.44L12 17.6l1.84 1.84M17.52 17.31l-.67-2.51 2.51-.67M19.36 9.87l-2.51-.67.67-2.51" />
    </svg>
  );
}
