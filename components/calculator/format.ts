"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

/** Locale-aware number / money / date formatters for the calculator. */
export function useFormat() {
  const locale = useLocale();

  return useMemo(() => {
    const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const decimal2 = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const money = (digits: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "UAH",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
    const uah = money(0);
    const uahPrice = money(2);
    const date = new Intl.DateTimeFormat(
      locale,
      locale === "uk"
        ? { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }
        : { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
    );

    return {
      /** Plain number, up to one decimal (kW, kWh). */
      number: (value: number) => decimal.format(value),
      /** Two decimals, no currency (₴/kWh prices where the unit is shown elsewhere). */
      decimal2: (value: number) => decimal2.format(value),
      /** Whole hryvnias: "1 234 567 ₴" / "₴1,234,567". */
      uah: (value: number) => uah.format(Math.round(value)),
      /** Price per kWh, two decimals. */
      price: (value: number) => uahPrice.format(value),
      /** ISO `YYYY-MM-DD` date. */
      date: (iso: string) => date.format(new Date(`${iso}T00:00:00Z`)),
    };
  }, [locale]);
}
