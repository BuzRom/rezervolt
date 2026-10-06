import { cn } from "@/lib/utils";
import { Depth, useSvgId } from "./parts";

type Kind = "main" | "rcd" | "mcb" | "spd" | "fuse" | "isolator";

// One DIN module = 26 units. Left → right: AC side, surge protection, DC (PV) side.
const DEVICES: { kind: Kind; x: number; poles: number; label?: string }[] = [
  { kind: "main", x: 74, poles: 2, label: "100A" },
  { kind: "rcd", x: 128, poles: 2, label: "30mA" },
  { kind: "mcb", x: 182, poles: 1, label: "C25" },
  { kind: "mcb", x: 208, poles: 1, label: "C16" },
  { kind: "mcb", x: 234, poles: 1, label: "C16" },
  { kind: "mcb", x: 260, poles: 1, label: "B10" },
  { kind: "mcb", x: 286, poles: 1, label: "B10" },
  { kind: "mcb", x: 312, poles: 1, label: "B6" },
  { kind: "spd", x: 346, poles: 2 },
  { kind: "fuse", x: 408, poles: 1 },
  { kind: "fuse", x: 434, poles: 1 },
  { kind: "isolator", x: 470, poles: 3, label: "DC 1000V" },
];

const TOP = 86;
const HEIGHT = 128;
const POLE = 26;
const STAGGER = 110; // ms between devices switching on

// Feeds entering from the top: AC into the main switch, PV strings into the DC isolator.
const FEEDS = [
  { d: "M87 98V40", color: "#2dd4bf" },
  { d: "M113 98V40", color: "#2dd4bf" },
  { d: "M483 98C483 70 478 58 478 40", color: "#fbbf24" },
  { d: "M535 98C535 70 540 58 540 40", color: "#fbbf24" },
];

function Terminals({ x, poles }: { x: number; poles: number }) {
  return Array.from({ length: poles }).flatMap((_, p) => {
    const cx = x + POLE / 2 + p * POLE;
    return [TOP + 12, TOP + HEIGHT - 12].map((cy) => (
      <g key={`${p}-${cy}`}>
        <circle cx={cx} cy={cy} r="4.5" className="fill-foreground/15" />
        <path d={`M${cx - 2.5} ${cy}H${cx + 2.5}`} strokeWidth="1.2" className="stroke-foreground/40" />
      </g>
    ));
  });
}

/** Toggle lever: rests down (off) and flips up when the card powers on. */
function Lever({ cx, width, order, accent }: { cx: number; width: number; order: number; accent?: boolean }) {
  return (
    <>
      <rect x={cx - width / 2 - 2} y={TOP + 50} width={width + 4} height="34" rx="3" className="fill-foreground/10" />
      <rect
        x={cx - width / 2}
        y={TOP + 67}
        width={width}
        height="14"
        rx="2"
        fill={accent ? "#f59e0b" : undefined}
        className={cn(
          "transition-[translate] duration-500 ease-out transform-fill powered:-translate-y-full",
          !accent && "fill-foreground/70",
        )}
        style={{ transitionDelay: `${300 + order * STAGGER}ms` }}
      />
    </>
  );
}

/** Status window: grey when off, green once the device is on. */
function Indicator({ x, y, order }: { x: number; y: number; order: number }) {
  return (
    <>
      <rect x={x} y={y} width="10" height="5" rx="1.5" className="fill-foreground/15" />
      <rect
        x={x}
        y={y}
        width="10"
        height="5"
        rx="1.5"
        fill="#34d399"
        className="opacity-0 transition-opacity duration-300 powered:opacity-100"
        style={{ transitionDelay: `${450 + order * STAGGER}ms` }}
      />
    </>
  );
}

/** Distribution board: AC protection, surge arrester and the PV-side DC isolator on a DIN rail. */
export function Switchgear({ className }: { className?: string }) {
  const id = useSvgId();

  return (
    <svg viewBox="0 0 640 300" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${id}-box`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--card)" }} />
          <stop offset="1" style={{ stopColor: "var(--muted)" }} />
        </linearGradient>
        <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--muted)" }} />
          <stop offset="1" style={{ stopColor: "var(--border)" }} />
        </linearGradient>
        <linearGradient id={`${id}-device`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--card)" }} />
          <stop offset="1" style={{ stopColor: "var(--muted)" }} />
        </linearGradient>
        <linearGradient id={`${id}-rail`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Enclosure */}
      <ellipse cx="324" cy="280" rx="280" ry="10" fill="#000" opacity="0.22" filter={`url(#${id}-shadow)`} />
      <Depth x={36} y={26} width={568} height={248} rx={20} dx={10} dy={-8} fill={`url(#${id}-depth)`} />
      <rect x="36" y="26" width="568" height="248" rx="20" fill={`url(#${id}-box)`} strokeWidth="1.5" className="stroke-border" />
      <rect x="50" y="40" width="540" height="220" rx="12" strokeWidth="1.2" className="fill-background/50 stroke-border" />

      {/* DIN rail */}
      <rect x="62" y="142" width="516" height="16" rx="2" fill={`url(#${id}-rail)`} opacity="0.75" />
      {Array.from({ length: 21 }, (_, i) => (
        <rect key={i} x={68 + i * 24.6} y="148" width="12" height="4" rx="2" fill="#475569" opacity="0.5" />
      ))}

      {/* Feeds (behind the devices, so they disappear into the terminals) */}
      {FEEDS.map((f) => (
        <g key={f.d}>
          <path d={f.d} strokeWidth="5" strokeLinecap="round" className="stroke-foreground/15" />
          <path
            d={f.d}
            stroke={f.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 9"
            className="opacity-0 transition-opacity delay-1000 duration-700 [animation-direction:reverse] powered:animate-flow powered:opacity-100"
          />
        </g>
      ))}
      {DEVICES.filter((d) => d.kind === "mcb").map((d) => (
        <path
          key={d.x}
          d={`M${d.x + POLE / 2} ${TOP + HEIGHT - 12}V258`}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-foreground/12"
        />
      ))}

      {DEVICES.map((dev, order) => {
        const width = dev.poles * POLE;
        const cx = dev.x + width / 2;
        return (
          <g key={dev.x}>
            <rect
              x={dev.x + 0.5}
              y={TOP}
              width={width - 1}
              height={HEIGHT}
              rx="3.5"
              fill={`url(#${id}-device)`}
              strokeWidth="1.2"
              className="stroke-border"
            />
            <rect x={dev.x + 3} y={TOP + 26} width={width - 6} height={HEIGHT - 52} rx="2" className="fill-foreground/4" />
            <Terminals x={dev.x} poles={dev.poles} />
            {dev.label && (
              <text
                x={cx}
                y={dev.kind === "isolator" ? TOP + HEIGHT - 26 : TOP + 40}
                fontSize="7"
                fontWeight="600"
                textAnchor="middle"
                className="fill-muted-foreground"
              >
                {dev.label}
              </text>
            )}

            {(dev.kind === "mcb" || dev.kind === "main" || dev.kind === "rcd") && (
              <>
                <Lever cx={cx} width={dev.kind === "mcb" ? 10 : 34} order={order} accent={dev.kind === "main"} />
                <Indicator x={cx - 5} y={TOP + 92} order={order} />
              </>
            )}
            {dev.kind === "rcd" && (
              <rect x={dev.x + width - 15} y={TOP + 92} width="9" height="9" rx="2" fill="#fbbf24" />
            )}

            {dev.kind === "spd" &&
              Array.from({ length: dev.poles }, (_, p) => (
                <g key={p}>
                  <rect
                    x={dev.x + 4 + p * POLE}
                    y={TOP + 24}
                    width={POLE - 8}
                    height={HEIGHT - 48}
                    rx="3"
                    strokeWidth="1.2"
                    className="fill-card stroke-border"
                  />
                  <Indicator x={dev.x + 8 + p * POLE} y={TOP + 34} order={order} />
                  <path
                    d={`M${dev.x + 13 + p * POLE} ${TOP + 52}l-3 8h4l-3 8`}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-foreground/35"
                  />
                </g>
              ))}

            {dev.kind === "fuse" && (
              <>
                <rect x={dev.x + 4} y={TOP + 22} width={POLE - 8} height={HEIGHT - 44} rx="3" className="fill-foreground/10" />
                {[0, 1, 2].map((r) => (
                  <path
                    key={r}
                    d={`M${dev.x + 9} ${TOP + 34 + r * 5}H${dev.x + POLE - 9}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="stroke-foreground/25"
                  />
                ))}
                <text x={cx} y={TOP + 74} fontSize="6" fontWeight="600" textAnchor="middle" className="fill-muted-foreground">
                  DC
                </text>
              </>
            )}

            {dev.kind === "isolator" && (
              <>
                <circle cx={cx} cy={TOP + 56} r="27" fill="#fbbf24" fillOpacity="0.85" />
                <circle cx={cx} cy={TOP + 56} r="21" strokeWidth="1.5" className="fill-card stroke-border" />
                <text x={cx - 33} y={TOP + 59} fontSize="7" fontWeight="700" textAnchor="middle" className="fill-muted-foreground">
                  0
                </text>
                <text x={cx} y={TOP + 24} fontSize="7" fontWeight="700" textAnchor="middle" className="fill-muted-foreground">
                  I
                </text>
                <rect
                  x={cx - 19}
                  y={TOP + 51}
                  width="38"
                  height="10"
                  rx="5"
                  fill="#dc2626"
                  className="origin-center transition-[rotate] duration-700 ease-out transform-fill powered:rotate-90"
                  style={{ transitionDelay: `${300 + order * STAGGER}ms` }}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
