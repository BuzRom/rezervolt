"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, Headphones, ShieldCheck, Zap } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Hero3D } from "@/components/three/hero-3d";

export function Hero() {
  const t = useTranslations("Hero");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia(root).add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero='badge']", { y: 18, opacity: 0, duration: 0.6 })
          .from(
            "[data-hero='line']",
            { yPercent: 115, duration: 0.9, stagger: 0.12 },
            "-=0.2",
          )
          .from("[data-hero='sub']", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
          .from("[data-hero='cta']", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(
            "[data-hero='trust'] > *",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.3",
          )
          .from("[data-hero='hint']", { opacity: 0, duration: 0.6 }, "-=0.2");
      });
    },
    { scope: root },
  );

  const trust = [
    { icon: ShieldCheck, value: "25", label: t("trust.warranty") },
    { icon: Zap, value: "100%", label: t("trust.turnkey") },
    { icon: Headphones, value: "24/7", label: t("trust.support") },
  ];

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-svh overflow-hidden pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-solar-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />

      <Container className="relative grid items-center gap-8 pb-20 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-2 lg:gap-6">
        <div className="relative z-10">
          <span
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-solar-700 dark:text-solar-400"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-solar-500" />
            {t("badge")}
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]">
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block">
                {t("titleLead")}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block text-gradient">
                {t("titleHighlight")}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block">
                {t("titleTail")}
              </span>
            </span>
          </h1>

          <p
            data-hero="sub"
            className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="#contact" size="lg">
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Magnetic>
            <Button href="#process" size="lg" variant="outline">
              {t("ctaSecondary")}
            </Button>
          </div>

          <div
            data-hero="trust"
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
          >
            {trust.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-solar-500" />
                <div className="leading-tight">
                  <div className="font-display text-lg font-bold">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          data-hero="canvas"
          className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
        >
          <Hero3D />
        </div>
      </Container>

      <div
        data-hero="hint"
        className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        {t("scrollHint")}
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
