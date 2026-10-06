"use client";

import { useTranslations } from "next-intl";
import {
  BatteryCharging,
  Building2,
  ChartCandlestick,
  Factory,
  Headset,
  Home,
  Power,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

type Service = { tag: string; title: string; desc: string };

const ICONS: LucideIcon[] = [
  Home,
  Building2,
  Factory,
  BatteryCharging,
  Power,
  Wrench,
  Headset,
  ChartCandlestick,
];

export function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as Service[];

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal
          stagger={0.08}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-all duration-500 lg:p-5 xl:p-6 hover:-translate-y-1.5 hover:border-solar-500/40 hover:shadow-soft"
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-solar-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-solar-400/20 to-solar-600/20 text-solar-600 ring-1 ring-solar-500/20 dark:text-solar-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-5 block text-xs font-semibold uppercase tracking-wider text-solar-700 dark:text-solar-400">
                    {item.tag}
                  </span>
                  <h3 className="mt-1.5 break-words text-lg font-semibold lg:text-base xl:text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
