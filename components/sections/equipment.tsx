"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { equipment, type Brand, type EquipmentId } from "@/lib/equipment";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SolarArray } from "@/components/illustrations/solar-array";
import { Inverter } from "@/components/illustrations/inverter";
import { BatteryStack } from "@/components/illustrations/battery-stack";
import { Switchgear } from "@/components/illustrations/switchgear";

type Category = { tag: string; title: string; desc: string; specs: string[] };

/** Illustration, bento width and the glow each card emits once powered. */
const VISUALS: Record<
  EquipmentId,
  { Art: (props: { className?: string }) => React.ReactNode; wide?: boolean; glow: string }
> = {
  panels: { Art: SolarArray, wide: true, glow: "bg-solar-500/20" },
  inverters: { Art: Inverter, glow: "bg-solar-500/15" },
  batteries: { Art: BatteryStack, glow: "bg-emerald-400/15" },
  protection: { Art: Switchgear, wide: true, glow: "bg-accent/15" },
};

// Logo tiles per row, by brand count (three → 2 + 1 full-width on phones).
const LOGO_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3 [&>li:last-child]:col-span-2 sm:[&>li:last-child]:col-span-1",
};

/** Wide wordmarks get shorter so every logo carries a similar visual weight. */
function logoSize({ width, height, scale = 1 }: Brand["logo"]) {
  const h = Math.round(Math.min(32, 50 / Math.sqrt(width / height)) * scale);
  return { width: Math.round((h * width) / height), height: h };
}

export function Equipment() {
  const t = useTranslations("Equipment");
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // Each card "powers on" (illustration comes alive, logos get their colors) every time it
  // scrolls into view, and powers off once it leaves — so the show replays in both directions.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-equip]");
      const powerOn = (card: HTMLElement) => card.setAttribute("data-powered", "");

      if (reduced) {
        cards.forEach(powerOn);
        return;
      }

      cards.forEach((card) => {
        let pending: gsap.core.Tween | undefined;
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          onToggle: ({ isActive }) => {
            pending?.kill();
            if (!isActive) {
              card.removeAttribute("data-powered");
              return;
            }
            // Cards further right in a row follow a beat later: sun → inverter → storage → board.
            const delay = card.offsetLeft > cards[0].offsetLeft ? 0.35 : 0;
            pending = gsap.delayedCall(delay, powerOn, [card]);
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="equipment" ref={root} className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map(({ id, brands }, i) => {
            const { Art, wide, glow } = VISUALS[id];
            const category = t.raw(`categories.${id}`) as Category;

            return (
              <article
                key={id}
                data-equip
                className={cn(
                  "group/equip relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-solar-500/40 hover:shadow-soft",
                  wide && "md:col-span-2",
                )}
              >
                <div className="relative h-56 overflow-hidden border-b border-border sm:h-64">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-grid opacity-40 mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
                  />
                  <div
                    aria-hidden
                    className={cn(
                      "absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-1000 powered:opacity-100",
                      glow,
                    )}
                  />
                  <Art className="relative h-full w-full px-4 pt-4 transition-transform duration-700 ease-out group-hover/equip:scale-[1.03]" />
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-solar-700 dark:text-solar-400">
                    <span className="font-display text-gradient">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-6 bg-border" />
                    {category.tag}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">{category.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {category.desc}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {category.specs.map((spec) => (
                      <li
                        key={spec}
                        className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-xs font-medium text-foreground/75"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>

                  <ul className={cn("mt-auto grid gap-2.5 pt-6", LOGO_GRID[brands.length])}>
                    {brands.map((brand) => (
                      <li
                        key={brand.name}
                        className="flex h-16 items-center justify-center rounded-2xl border border-border bg-background/40 px-4"
                      >
                        <Image
                          src={brand.logo.src}
                          alt={brand.name}
                          {...logoSize(brand.logo)}
                          data-invert-dark={brand.invertOnDark || undefined}
                          className="brand-logo h-auto max-w-full"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="max-w-xl text-pretty text-muted-foreground">{t("ctaNote")}</p>
          <Button href="#contact" variant="outline" size="lg">
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
        <p className="mt-10 text-center text-xs text-muted-foreground/70">{t("trademarks")}</p>
      </Container>
    </section>
  );
}
