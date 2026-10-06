import { cn } from "@/lib/utils";
import { Depth, useSvgId } from "./parts";

const MODULE_Y = [74, 128, 182]; // top → bottom
const SOC_BARS = 5;

/** Stack of rack LiFePO₄ modules; once powered the SOC bars fill up and the top one keeps charging. */
export function BatteryStack({ className }: { className?: string }) {
  const id = useSvgId();
  const depth = `url(#${id}-depth)`;

  return (
    <svg viewBox="0 0 320 300" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--card)" }} />
          <stop offset="1" style={{ stopColor: "var(--muted)" }} />
        </linearGradient>
        <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--muted)" }} />
          <stop offset="1" style={{ stopColor: "var(--border)" }} />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Charging badge */}
      <g className="opacity-0 transition-opacity delay-700 duration-700 powered:opacity-100">
        <circle cx="154" cy="32" r="13" fill="#34d399" fillOpacity="0.14" stroke="#34d399" strokeOpacity="0.5" />
        <path
          d="M156.5 23.5L149 33.5H154.5L151.5 40.5L159 30.5H153.5Z"
          fill="#34d399"
          className="powered:animate-charge"
        />
      </g>

      {/* Floor shadow + plinth */}
      <ellipse cx="156" cy="250" rx="112" ry="9" fill="#000" opacity="0.25" filter={`url(#${id}-shadow)`} />
      <Depth x={52} y={232} width={192} height={10} rx={3} dx={12} dy={-9} fill={depth} />
      <rect x="52" y="232" width="192" height="10" rx="3" strokeWidth="1.5" className="fill-muted stroke-border" />

      {/* Modules, bottom first so each one overlaps the top face of the one below */}
      {[...MODULE_Y].reverse().map((y) => {
        const row = MODULE_Y.indexOf(y);
        return (
          <g key={y}>
            <Depth x={56} y={y} width={184} height={48} rx={5} dx={12} dy={-9} fill={depth} />
            <rect
              x="56"
              y={y}
              width="184"
              height="48"
              rx="5"
              fill={`url(#${id}-body)`}
              strokeWidth="1.5"
              className="stroke-border"
            />
            {[64, 224].map((x) => (
              <rect
                key={x}
                x={x}
                y={y + 9}
                width="8"
                height="30"
                rx="4"
                strokeWidth="2.5"
                className="stroke-foreground/20"
              />
            ))}

            {/* Display: state-of-charge bars + run LED */}
            <rect x="82" y={y + 9} width="86" height="16" rx="4" fill="#0b1322" />
            {Array.from({ length: SOC_BARS }, (_, i) => (
              <g key={i}>
                <rect x={88 + i * 13} y={y + 14} width="9" height="6" rx="2" fill="#1e293b" />
                <rect
                  x={88 + i * 13}
                  y={y + 14}
                  width="9"
                  height="6"
                  rx="2"
                  fill="#34d399"
                  className={cn(
                    "opacity-0 transition-opacity duration-300 powered:opacity-100",
                    i === SOC_BARS - 1 && "powered:animate-charge",
                  )}
                  style={{ transitionDelay: `${250 + i * 150 + row * 60}ms` }}
                />
              </g>
            ))}
            <circle cx="158" cy={y + 17} r="2.5" fill="#1e293b" />
            <g className="opacity-0 transition-opacity delay-300 duration-500 powered:opacity-100">
              <circle cx="158" cy={y + 17} r="4" fill="#34d399" opacity="0.6" filter={`url(#${id}-glow)`} />
              <circle cx="158" cy={y + 17} r="2.5" fill="#34d399" />
            </g>
            <text x="82" y={y + 38} fontSize="6.5" letterSpacing="0.4" className="fill-muted-foreground">
              LiFePO₄ · 51.2V
            </text>

            {/* Power button + DC terminals */}
            <circle cx="180" cy={y + 17} r="6" strokeWidth="1.5" className="fill-muted stroke-foreground/25" />
            <path
              d={`M178 ${y + 15}a3 3 0 1 0 4 0M180 ${y + 13}v3.5`}
              strokeWidth="1.2"
              strokeLinecap="round"
              className="stroke-foreground/45"
            />
            <circle cx="198" cy={y + 36} r="4" fill="#f59e0b" />
            <circle cx="212" cy={y + 36} r="4" fill="#334155" />
          </g>
        );
      })}

      {/* Parallel links between modules */}
      {MODULE_Y.slice(0, -1).map((y, i) => {
        const [y1, y2] = [y + 36, MODULE_Y[i + 1] + 36];
        return (
          <g key={y} strokeWidth="3" strokeLinecap="round">
            <path d={`M198 ${y1}C193 ${y1 + 14} 193 ${y2 - 14} 198 ${y2}`} stroke="#f59e0b" />
            <path d={`M212 ${y1}C217 ${y1 + 14} 217 ${y2 - 14} 212 ${y2}`} stroke="#334155" />
          </g>
        );
      })}
    </svg>
  );
}
