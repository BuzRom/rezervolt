"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFormat } from "./format";

const ACTIONS = {
  1: { key: "charge", bar: "bg-chart-charge" },
  [-1]: { key: "discharge", bar: "bg-chart-discharge" },
  0: { key: "idle", bar: "bg-muted-foreground/30" },
} as const;

const actionOf = (value: number) => ACTIONS[value as keyof typeof ACTIONS] ?? ACTIONS[0];

const hourRange = (hour: number) =>
  `${String(hour).padStart(2, "0")}:00–${String(hour + 1).padStart(2, "0")}:00`;

/** Clean y-axis: steps of 1 / 2 / 5 ₴ up to the first tick above the peak. */
function axisTicks(max: number) {
  const step = max > 10 ? 5 : max > 4 ? 2 : 1;
  const top = Math.max(step, Math.ceil(max / step) * step);
  return Array.from({ length: top / step + 1 }, (_, i) => i * step);
}

/** Average DAM price for each hour of the day; bars are colored by the battery's plan. */
export function DamChart({ profile, schedule }: { profile: number[]; schedule: number[] }) {
  const t = useTranslations("Calculator.storage");
  const fmt = useFormat();
  const [active, setActive] = useState<number | null>(null);

  const ticks = axisTicks(Math.max(...profile));
  const top = ticks[ticks.length - 1];

  return (
    <figure className="rounded-2xl border border-border bg-background/60 p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">{t("chartTitle")}</span>
        <span className="text-xs text-muted-foreground">{t("chartUnit")}</span>
      </figcaption>

      <div aria-hidden className="mt-5">
        <div className="relative h-40 pl-7" onPointerLeave={() => setActive(null)}>
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 flex translate-y-1/2 items-center"
              style={{ bottom: `${(tick / top) * 100}%` }}
            >
              <span className="w-7 pr-2 text-right text-[10px] leading-none tabular-nums text-muted-foreground">
                {tick}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          ))}

          <div className="absolute inset-y-0 left-7 right-0 flex items-end gap-0.5">
            {profile.map((price, hour) => (
              <div
                key={hour}
                className="flex h-full flex-1 items-end justify-center"
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(hour)}
                onPointerDown={() => setActive(hour)}
              >
                <div
                  className={cn(
                    "min-h-0.5 w-full max-w-6 rounded-t-[4px] transition-[height,opacity,background-color] duration-500 motion-reduce:transition-none",
                    actionOf(schedule[hour]).bar,
                    active !== null && active !== hour && "opacity-45",
                  )}
                  style={{ height: `${(price / top) * 100}%` }}
                />
              </div>
            ))}
          </div>

          {active !== null && (
            <div
              className={cn(
                "pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg",
                active < 4 ? "" : active > 19 ? "-translate-x-full" : "-translate-x-1/2",
              )}
              style={{
                left: `calc(1.75rem + (100% - 1.75rem) * ${(active + (active < 4 ? 0 : active > 19 ? 1 : 0.5)) / 24})`,
              }}
            >
              <div className="text-muted-foreground">{hourRange(active)}</div>
              <div className="mt-0.5 font-semibold tabular-nums">{fmt.price(profile[active])}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", actionOf(schedule[active]).bar)} />
                {t(`legend.${actionOf(schedule[active]).key}`)}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex pl-7 text-[10px] tabular-nums text-muted-foreground">
          {profile.map((_, hour) => (
            <span key={hour} className="flex-1 text-center">
              {hour % 3 === 0 ? String(hour).padStart(2, "0") : ""}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {([1, -1, 0] as const).map((value) => (
          <li key={value} className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-[3px]", ACTIONS[value].bar)} />
            {t(`legend.${ACTIONS[value].key}`)}
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>{t("chartTable")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("hour")}</th>
            <th scope="col">{t("price")}</th>
            <th scope="col">{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {profile.map((price, hour) => (
            <tr key={hour}>
              <th scope="row">{hourRange(hour)}</th>
              <td>{fmt.price(price)}</td>
              <td>{t(`legend.${actionOf(schedule[hour]).key}`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
