import { cn } from "@/lib/utils";
import { useSvgId } from "./parts";

type Pt = readonly [number, number];

/** Projective map of the unit square onto a quad (TL, TR, BR, BL) — real perspective in plain SVG. */
function quadMap([x0, y0]: Pt, [x1, y1]: Pt, [x2, y2]: Pt, [x3, y3]: Pt) {
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const [dx1, dx2, dy1, dy2] = [x1 - x2, x3 - x2, y1 - y2, y3 - y2];
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / det;
  const h = (dx1 * sy - sx * dy1) / det;
  const [a, b] = [x1 - x0 + g * x1, x3 - x0 + h * x3];
  const [d, e] = [y1 - y0 + g * y1, y3 - y0 + h * y3];
  return (u: number, v: number): Pt => {
    const w = g * u + h * v + 1;
    return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w];
  };
}

const fmt = ([x, y]: Pt) => `${x.toFixed(1)} ${y.toFixed(1)}`;

// A row of three portrait modules on a sloped roof, seen from below.
const ARRAY = quadMap([178, 70], [498, 70], [592, 244], [48, 244]);
const MODULES = 3;
const GAP = 0.016; // between modules, in array units
const FRAME_U = 0.012;
const FRAME_V = 0.024;
const COLS = 6;
const ROWS = 20; // half-cut cells: two blocks of 10 rows

const quad = (u0: number, v0: number, u1: number, v1: number) =>
  `M${fmt(ARRAY(u0, v0))}L${fmt(ARRAY(u1, v0))}L${fmt(ARRAY(u1, v1))}L${fmt(ARRAY(u0, v1))}Z`;

const modules = Array.from({ length: MODULES }, (_, i) => {
  const width = (1 - GAP * (MODULES - 1)) / MODULES;
  const u0 = i * (width + GAP);
  const u1 = u0 + width;
  const [cu0, cu1, cv0, cv1] = [u0 + FRAME_U, u1 - FRAME_U, FRAME_V, 1 - FRAME_V];
  const u = (s: number) => cu0 + (cu1 - cu0) * s;
  const v = (t: number) => cv0 + (cv1 - cv0) * t;

  let grid = "";
  for (let c = 1; c < COLS; c++) {
    grid += `M${fmt(ARRAY(u(c / COLS), cv0))}L${fmt(ARRAY(u(c / COLS), cv1))}`;
  }
  for (let r = 1; r < ROWS; r++) {
    if (r === ROWS / 2) continue;
    grid += `M${fmt(ARRAY(cu0, v(r / ROWS)))}L${fmt(ARRAY(cu1, v(r / ROWS)))}`;
  }

  const [bl, br] = [ARRAY(u0, 1), ARRAY(u1, 1)];
  return {
    frame: quad(u0, 0, u1, 1),
    glass: quad(cu0, cv0, cu1, cv1),
    grid,
    split: `M${fmt(ARRAY(cu0, v(0.5)))}L${fmt(ARRAY(cu1, v(0.5)))}`,
    // Front edge of the frame — sells the module's thickness.
    edge: `M${fmt(bl)}L${fmt(br)}L${fmt([br[0], br[1] + 7])}L${fmt([bl[0], bl[1] + 7])}Z`,
  };
});

const GLASS = modules.map((m) => m.glass).join("");

/** Solar modules in perspective; once powered the sun brightens and a glare sweeps the glass. */
export function SolarArray({ className }: { className?: string }) {
  const id = useSvgId();

  return (
    // Visible overflow lets the sun's halo spill into the card padding instead of being cut.
    <svg viewBox="0 0 640 300" fill="none" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.2" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#f59e0b" stopOpacity="0.18" />
          <stop offset="0.75" stopColor="#f59e0b" stopOpacity="0.06" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id={`${id}-cells`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d4178" />
          <stop offset="0.5" stopColor="#102b55" />
          <stop offset="1" stopColor="#0a1c3a" />
        </linearGradient>
        <linearGradient id={`${id}-sunlit`} x1="1" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="0.65" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-glare`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-glass`}>
          <path d={GLASS} />
        </clipPath>
      </defs>

      {/* Sun */}
      <circle
        cx="580"
        cy="66"
        r="86"
        fill={`url(#${id}-sun)`}
        className="opacity-40 transition-opacity duration-1000 powered:opacity-100"
      />
      <circle cx="580" cy="66" r="16" fill="#fcd34d" />

      <ellipse cx="320" cy="262" rx="300" ry="18" fill={`url(#${id}-shadow)`} />

      {modules.map((m) => (
        <g key={m.frame}>
          <path d={m.edge} fill="#64748b" />
          <path d={m.frame} fill={`url(#${id}-frame)`} stroke="#64748b" strokeOpacity="0.5" />
          <path d={m.glass} fill={`url(#${id}-cells)`} />
          <path d={m.grid} stroke="#081325" strokeWidth="1.1" />
          <path d={m.split} stroke="#081325" strokeWidth="2.6" />
        </g>
      ))}

      <g clipPath={`url(#${id}-glass)`}>
        <rect
          width="640"
          height="300"
          fill={`url(#${id}-sunlit)`}
          className="opacity-0 transition-opacity duration-1000 powered:opacity-100"
        />
        {/* Drawn off-canvas on the left; the animation sweeps it across. */}
        <path
          d="M-130 30H-40L-150 290H-240Z"
          fill={`url(#${id}-glare)`}
          className="opacity-0 powered:animate-glare powered:opacity-100"
        />
      </g>
    </svg>
  );
}
