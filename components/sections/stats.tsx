"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/container";

type Stat = { value: number; suffix: string; label: string };

export function Stats() {
  const t = useTranslations("Stats");
  const items = t.raw("items") as Stat[];
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia(root).add(MOTION_OK, () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-counter]");
        els.forEach((el) => {
          const end = Number(el.dataset.value);
          const obj = { v: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            v: end,
            duration: 2,
            ease: "power2.out",
            snap: { v: 1 },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });
        return () => {
          els.forEach((el) => {
            el.textContent = el.dataset.value ?? "";
          });
        };
      });
    },
    { scope: root },
  );

  return (
    <section className="relative py-8">
      <Container>
        <div
          ref={root}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4"
        >
          {items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-card/60 px-4 py-10 text-center"
            >
              <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="sr-only">{`${stat.value}${stat.suffix}`}</span>
                <span aria-hidden className="inline-grid tabular-nums">
                  <span className="invisible col-start-1 row-start-1">{stat.value}</span>
                  <span
                    data-counter
                    data-value={stat.value}
                    className="col-start-1 row-start-1"
                  >
                    {stat.value}
                  </span>
                </span>
                <span aria-hidden className="text-gradient">
                  {stat.suffix}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
