"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Sun, TrendingDown, Wallet, Zap } from "lucide-react";
import { DEFAULT_TARIFF, VAT_RATE, calcSolar, consumptionSteps, solar } from "@/lib/calculator";
import { StepSlider } from "./controls";
import { Assumptions, ModeLayout, Results } from "./results";
import { useFormat } from "./format";

export function SolarCalculator() {
  const t = useTranslations("Calculator");
  const fmt = useFormat();
  const tariffId = useId();
  const [monthlyKwh, setMonthlyKwh] = useState(1000);
  const [tariffInput, setTariffInput] = useState(String(DEFAULT_TARIFF));

  const parsed = Number(tariffInput.replace(",", "."));
  const tariffValid = parsed > 0 && parsed <= 100;
  const tariff = tariffValid ? parsed : DEFAULT_TARIFF;
  const result = calcSolar(monthlyKwh, tariff);

  return (
    <ModeLayout
      inputs={
        <>
          <p className="text-pretty text-muted-foreground">{t("solar.intro")}</p>

          <StepSlider
            label={t("solar.consumptionLabel")}
            steps={consumptionSteps}
            value={monthlyKwh}
            onChange={setMonthlyKwh}
            display={t("solar.consumptionValue", { value: fmt.number(monthlyKwh) })}
            hint={t("solar.billHint", { bill: fmt.uah(monthlyKwh * tariff) })}
          />

          <div>
            <label htmlFor={tariffId} className="text-sm font-medium text-muted-foreground">
              {t("solar.tariffLabel")}
            </label>
            <input
              id={tariffId}
              type="text"
              inputMode="decimal"
              value={tariffInput}
              onChange={(e) => setTariffInput(e.target.value)}
              aria-invalid={!tariffValid}
              className="mt-3 block h-12 w-32 rounded-xl border border-input bg-background/60 px-4 font-display text-lg font-bold tabular-nums transition-colors duration-300 focus:border-solar-500 focus:outline-none aria-invalid:border-red-500/70"
            />
          </div>
        </>
      }
      results={
        <Results
          metrics={[
            {
              icon: Sun,
              label: t("solar.system"),
              value: t("solar.systemValue", { value: fmt.number(result.kw) }),
            },
            {
              icon: Zap,
              label: t("solar.generation"),
              value: t("solar.generationValue", { value: fmt.number(result.generation) }),
            },
            { icon: TrendingDown, label: t("savings"), value: fmt.uah(result.savings) },
            { icon: Wallet, label: t("cost"), value: fmt.uah(result.cost.total) },
          ]}
          payback={result.payback}
          cost={result.cost}
        />
      }
      details={
        <Assumptions
          items={[
            t("assumptions.solarYield", { value: fmt.number(solar.specificYield) }),
            t("assumptions.solarCoverage", { value: solar.coverage * 100 }),
            t("assumptions.solarSelfUse", { value: solar.selfUse * 100 }),
            t("assumptions.vat", { value: VAT_RATE * 100 }),
          ]}
        />
      }
    />
  );
}
