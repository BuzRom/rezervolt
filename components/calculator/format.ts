"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

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
      number: (value: number) => decimal.format(value),
      decimal2: (value: number) => decimal2.format(value),
      uah: (value: number) => uah.format(Math.round(value)),
      price: (value: number) => uahPrice.format(value),
      date: (iso: string) => date.format(new Date(`${iso}T00:00:00Z`)),
    };
  }, [locale]);
}
