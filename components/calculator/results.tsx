"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Clock, type LucideIcon } from "lucide-react";
import { VAT_RATE, type CostEstimate } from "@/lib/calculator";
import { useFormat } from "./format";

export function ModeLayout({
  inputs,
  results,
  details,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="flex min-w-0 flex-col gap-8">{inputs}</div>
      <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">{results}</div>
      <div className="flex min-w-0 flex-col gap-8">{details}</div>
    </div>
  );
}

export type MetricItem = { icon: LucideIcon; label: string; value: string; hint?: string };

const MAX_PAYBACK = 25;

export function Results({
  metrics,
  payback,
  cost,
}: {
  metrics: MetricItem[];
  payback: number;
  cost: CostEstimate;
}) {
  const t = useTranslations("Calculator");
  const years = Math.round(payback * 10) / 10;

  return (
    <div className="grid gap-3">
      <dl className="grid gap-3 sm:grid-cols-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-background/60 p-5">
            <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-solar-400/20 to-solar-600/20 text-solar-600 ring-1 ring-solar-500/20 dark:text-solar-400">
                <m.icon className="h-4 w-4" />
              </span>
              {m.label}
            </dt>
            <dd className="mt-3 font-display text-xl font-bold tracking-tight">{m.value}</dd>
            {m.hint && <dd className="mt-1 text-xs text-muted-foreground">{m.hint}</dd>}
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-5 rounded-2xl border border-solar-500/40 bg-gradient-to-br from-solar-400/15 to-solar-600/10 p-6">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 text-primary-foreground">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{t("payback")}</div>
          <div className="font-display text-3xl font-bold tracking-tight" aria-live="polite">
            {Number.isFinite(years) && years <= MAX_PAYBACK
              ? t("paybackValue", { years })
              : t("noPayback")}
          </div>
        </div>
      </div>

      <CostBreakdown cost={cost} />
    </div>
  );
}

function CostBreakdown({ cost }: { cost: CostEstimate }) {
  const t = useTranslations("Calculator.breakdown");
  const fmt = useFormat();
  const titleId = useId();
  const groups = (["equipment", "works"] as const).map((group) => ({
    group,
    lines: cost.lines.filter((line) => line.group === group),
  }));

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5 sm:p-6">
      <h3 id={titleId} className="font-display text-base font-semibold">{t("title")}</h3>
      <table aria-labelledby={titleId} className="mt-3 w-full text-sm">
        {groups.map(({ group, lines }) => (
          <tbody key={group}>
            <tr>
              <th
                scope="rowgroup"
                className="pb-1 pt-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {t(group)}
              </th>
              <td />
            </tr>
            {lines.map((line) => (
              <tr key={line.id}>
                <th scope="row" className="py-1 pr-4 text-left font-normal text-foreground/85">
                  {t(`items.${line.id}`)}
                </th>
                <td className="whitespace-nowrap py-1 text-right tabular-nums">
                  {fmt.uah(line.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
        <tfoot className="border-t border-border">
          <tr>
            <th scope="row" className="pb-1 pt-3 text-left font-normal text-muted-foreground">
              {t("net")}
            </th>
            <td className="whitespace-nowrap pb-1 pt-3 text-right tabular-nums">
              {fmt.uah(cost.net)}
            </td>
          </tr>
          <tr>
            <th scope="row" className="py-1 text-left font-normal text-muted-foreground">
              {t("vat", { rate: VAT_RATE * 100 })}
            </th>
            <td className="whitespace-nowrap py-1 text-right tabular-nums">{fmt.uah(cost.vat)}</td>
          </tr>
          <tr>
            <th scope="row" className="pt-1 text-left font-semibold">
              {t("total")}
            </th>
            <td className="whitespace-nowrap pt-1 text-right font-display text-sm font-bold tabular-nums sm:text-base">
              {fmt.uah(cost.total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function Assumptions({ items }: { items: string[] }) {
  const t = useTranslations("Calculator.assumptions");

  return (
    <div>
      <h3 className="text-sm font-semibold">{t("title")}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-solar-400 to-solar-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
