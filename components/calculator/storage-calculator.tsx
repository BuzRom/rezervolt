"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftRight, BatteryCharging, TrendingDown, Wallet } from "lucide-react";
import { VAT_RATE, calcStorage, capacitySteps, storage } from "@/lib/calculator";
import { DAM_SOURCE_URL, type Cycles, type DamPeriod, type DamStats } from "@/lib/dam";
import { Segmented, StepSlider } from "./controls";
import { DamChart } from "./dam-chart";
import { Assumptions, ModeLayout, Results } from "./results";
import { useFormat } from "./format";

export function StorageCalculator({ dam }: { dam: DamStats }) {
  const t = useTranslations("Calculator");
  const fmt = useFormat();
  const [capacity, setCapacity] = useState(100);
  const [cycles, setCycles] = useState<Cycles>(1);
  const [period, setPeriod] = useState<DamPeriod>("year");

  const prices = dam.windows[period];
  const arbitrage = prices.arbitrage[cycles];
  const result = calcStorage(capacity, arbitrage);

  return (
    <ModeLayout
      inputs={
        <>
          <p className="text-pretty text-muted-foreground">{t("storage.intro")}</p>

          <StepSlider
            label={t("storage.capacityLabel")}
            steps={capacitySteps}
            value={capacity}
            onChange={setCapacity}
            display={t("storage.capacityValue", { value: fmt.number(capacity) })}
          />

          <div className="flex flex-wrap gap-x-8 gap-y-6">
            <Segmented
              label={t("storage.cyclesLabel")}
              options={([1, 2] as const).map((value) => ({
                value,
                label: t(`storage.cycles.${value}`),
              }))}
              value={cycles}
              onChange={setCycles}
            />
            <Segmented
              label={t("storage.periodLabel")}
              options={(["month", "year"] as const).map((value) => ({
                value,
                label: t(`storage.periods.${value}`),
              }))}
              value={period}
              onChange={setPeriod}
            />
          </div>
        </>
      }
      results={
        <Results
          metrics={[
            {
              icon: BatteryCharging,
              label: t("storage.system"),
              value: t("storage.systemValue", { power: fmt.number(result.powerKw) }),
              hint: t("storage.systemHint", {
                capacity: fmt.number(capacity),
                hours: storage.durationHours,
              }),
            },
            {
              icon: ArrowLeftRight,
              label: t("storage.spread"),
              value: t("storage.spreadValue", {
                charge: fmt.decimal2(arbitrage.chargePrice),
                discharge: fmt.decimal2(arbitrage.dischargePrice),
              }),
              hint: t("storage.spreadHint"),
            },
            { icon: TrendingDown, label: t("savings"), value: fmt.uah(result.savings) },
            { icon: Wallet, label: t("cost"), value: fmt.uah(result.cost.total) },
          ]}
          payback={result.payback}
          cost={result.cost}
        />
      }
      details={
        <>
          <div>
            <DamChart profile={prices.profile} schedule={prices.schedule[cycles]} />
            <p className="mt-3 text-xs text-muted-foreground">
              {t.rich("storage.source", {
                link: (chunks) => (
                  <a
                    href={DAM_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground hover:decoration-solar-500"
                  >
                    {chunks}
                  </a>
                ),
                from: fmt.date(prices.from),
                to: fmt.date(prices.to),
              })}
              {dam.source === "snapshot" && ` (${t("storage.snapshot")})`}
            </p>
          </div>

          <Assumptions
            items={[
              t("assumptions.storagePlan"),
              t("assumptions.storageEfficiency", {
                value: storage.efficiency * 100,
                availability: storage.availability * 100,
              }),
              t("assumptions.storageFees", { fee: fmt.price(storage.gridFee) }),
              t("assumptions.storageLoad"),
              t("assumptions.vat", { value: VAT_RATE * 100 }),
            ]}
          />
        </>
      }
    />
  );
}
