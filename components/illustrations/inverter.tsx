import { cn } from "@/lib/utils";
import { Depth, useSvgId } from "./parts";

// Cables leaving the bottom glands: PV strings flow in (up), battery and AC flow out (down).
const CABLES = [
  { d: "M124 206C124 242 106 258 100 300", color: "#fbbf24", up: true },
  { d: "M142 206C142 246 132 264 130 300", color: "#fbbf24", up: true },
  { d: "M160 206V300", color: "#34d399", up: false },
  { d: "M178 206C178 246 188 264 190 300", color: "#2dd4bf", up: false },
  { d: "M196 206C196 242 214 258 220 300", color: "#2dd4bf", up: false },
];

const LEDS = [
  { cy: 62, color: "#34d399", blink: false },
  { cy: 74, color: "#fbbf24", blink: true },
  { cy: 86, color: "#2dd4bf", blink: false },
];

/** Wall-mounted hybrid inverter; once powered its screen, LEDs and cable flows come alive. */
export function Inverter({ className }: { className?: string }) {
  const id = useSvgId();

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
        <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f3b3f" />
          <stop offset="1" stopColor="#0a2228" />
        </linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#ea7a0c" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {CABLES.map((c) => (
        <g key={c.d}>
          <path d={c.d} strokeWidth="5" strokeLinecap="round" className="stroke-foreground/15" />
          <path
            d={c.d}
            stroke={c.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 9"
            className={cn(
              "opacity-0 transition-opacity delay-700 duration-700 powered:animate-flow powered:opacity-100",
              c.up && "[animation-direction:reverse]",
            )}
          />
        </g>
      ))}

      {/* Wall shadow + housing */}
      <rect
        x="106"
        y="42"
        width="124"
        height="186"
        rx="14"
        fill="#000"
        opacity="0.22"
        filter={`url(#${id}-shadow)`}
      />
      <Depth x={100} y={30} width={120} height={186} rx={12} dx={10} dy={-8} fill={`url(#${id}-depth)`} />
      <rect
        x="100"
        y="30"
        width="120"
        height="186"
        rx="12"
        fill={`url(#${id}-body)`}
        strokeWidth="1.5"
        className="stroke-border"
      />

      {/* Glass front: screen, status LEDs, buttons */}
      <rect x="110" y="42" width="100" height="80" rx="8" fill="#0b1322" stroke="#1c2638" />
      <rect x="120" y="52" width="58" height="40" rx="4" fill="#0f1727" />
      <g className="opacity-0 transition-opacity delay-200 duration-700 powered:opacity-100">
        <rect x="120" y="52" width="58" height="40" rx="4" fill={`url(#${id}-screen)`} />
        <text x="126" y="62" fontSize="6" letterSpacing="0.6" fill="#7dd3c8">
          PV
        </text>
        <text x="126" y="79">
          <tspan fontSize="15" fontWeight="700" fill="#fcd34d" className="font-display">
            5.2
          </tspan>
          <tspan dx="2" fontSize="6.5" fill="#fbbf24">
            kW
          </tspan>
        </text>
        <polyline
          points="126,87 132,85 138,86 144,82 150,83 156,79 162,80 172,76"
          stroke="#2dd4bf"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {LEDS.map((led, i) => (
        <g key={led.cy}>
          <circle cx="195" cy={led.cy} r="3" fill="#1e293b" />
          <g
            className="opacity-0 transition-opacity duration-500 powered:opacity-100"
            style={{ transitionDelay: `${300 + i * 150}ms` }}
          >
            <circle
              cx="195"
              cy={led.cy}
              r="5"
              fill={led.color}
              opacity="0.6"
              filter={`url(#${id}-glow)`}
              className={cn(led.blink && "powered:animate-blink")}
            />
            <circle
              cx="195"
              cy={led.cy}
              r="3"
              fill={led.color}
              className={cn(led.blink && "powered:animate-blink")}
            />
          </g>
        </g>
      ))}
      {[122, 138, 154, 170].map((x) => (
        <rect key={x} x={x} y="104" width="10" height="5" rx="2.5" fill="#1c2638" />
      ))}

      {/* Status light bar */}
      <rect x="128" y="134" width="64" height="4" rx="2" className="fill-border" />
      <g className="opacity-0 transition-opacity delay-500 duration-700 powered:opacity-100">
        <rect
          x="126"
          y="132"
          width="68"
          height="8"
          rx="4"
          fill="#fbbf24"
          opacity="0.5"
          filter={`url(#${id}-glow)`}
        />
        <rect x="128" y="134" width="64" height="4" rx="2" fill={`url(#${id}-bar)`} />
      </g>

      {/* Vent grille */}
      {[152, 160, 168, 176].map((y) => (
        <path
          key={y}
          d={`M124 ${y}H196`}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-border"
        />
      ))}

      {/* Connection panel with cable glands */}
      <rect x="110" y="190" width="100" height="18" rx="5" className="fill-muted stroke-border" />
      {[124, 142, 160, 178, 196].map((cx) => (
        <circle key={cx} cx={cx} cy="199" r="5" fill="#1b2436" stroke="#2c3649" />
      ))}
    </svg>
  );
}
