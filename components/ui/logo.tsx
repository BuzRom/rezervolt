import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
          <defs>
            <linearGradient id="logo-sun" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-solar-400)" />
              <stop offset="100%" stopColor="var(--color-solar-600)" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="8" fill="url(#logo-sun)" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 20 + Math.cos(a) * 12;
            const y1 = 20 + Math.sin(a) * 12;
            const x2 = 20 + Math.cos(a) * 17;
            const y2 = 20 + Math.sin(a) * 17;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#logo-sun)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        {site.name}
      </span>
    </span>
  );
}
