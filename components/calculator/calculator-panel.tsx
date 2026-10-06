"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { DamStats } from "@/lib/dam";
import { Button } from "@/components/ui/button";
import { Segmented } from "./controls";
import { SolarCalculator } from "./solar-calculator";
import { StorageCalculator } from "./storage-calculator";

type Mode = "solar" | "storage";

/** Interactive part of the calculator: a solar plant or a grid-charged battery (DAM arbitrage). */
export function CalculatorPanel({ dam }: { dam: DamStats }) {
  const t = useTranslations("Calculator");
  const [mode, setMode] = useState<Mode>("solar");

  return (
    <div>
      <Segmented
        label={t("modeLabel")}
        hideLabel
        stretch
        options={(["solar", "storage"] as const).map((value) => ({
          value,
          label: t(`modes.${value}`),
        }))}
        value={mode}
        onChange={setMode}
      />

      {/* Both stay mounted so switching modes keeps the inputs. */}
      <div className="mt-8">
        <div hidden={mode !== "solar"}>
          <SolarCalculator />
        </div>
        <div hidden={mode !== "storage"}>
          <StorageCalculator dam={dam} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button
          href="#contact"
          size="lg"
          className="w-full shrink-0 px-5 text-[15px] max-sm:[&>svg]:hidden sm:w-auto sm:px-7 sm:text-base"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="max-w-xl text-xs text-muted-foreground sm:text-right">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
