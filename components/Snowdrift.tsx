/**
 * Soft snowdrift edge where a night section meets an ivory one: a moonlit
 * blue far hill, then the ivory of the neighbouring section as the near one.
 * `edge="bottom"` sits at the foot of a night section (drifts rise into the
 * ivory below); `edge="top"` mirrors it so the ivory above melts down into the
 * night. `flip` mirrors it left-to-right so neighbouring edges don't repeat.
 */
export default function Snowdrift({
  edge = "bottom",
  flip = false,
  className = "",
}: {
  edge?: "top" | "bottom";
  flip?: boolean;
  className?: string;
}) {
  const t = [edge === "top" ? "-scale-y-100" : "", flip ? "-scale-x-100" : ""].join(" ");
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-[1] h-16 w-full sm:h-24 md:h-28 ${
        edge === "top" ? "-top-px" : "-bottom-px"
      } ${t} ${className}`}
    >
      <path d="M0 64C160 30 330 26 520 56s380 50 560 22 270-44 360-26V120H0Z" fill="#2d3e58" />
      <path d="M0 88c190-34 390-38 600-12s420 34 590 8 210-24 250-18V120H0Z" fill="#f6f1e9" />
    </svg>
  );
}
