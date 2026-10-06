"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, Layers, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

type Item = { title: string; desc: string };

const ICONS: LucideIcon[] = [Layers, BadgeCheck, ShieldCheck, Wallet];

export function WhyUs() {
  const t = useTranslations("WhyUs");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                className="group relative flex gap-5 rounded-2xl border border-border bg-card/40 p-7 transition-colors duration-500 hover:border-solar-500/40"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-solar-400 to-solar-600 text-primary-foreground shadow-[0_8px_24px_-8px_rgb(var(--glow)/0.7)]">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
