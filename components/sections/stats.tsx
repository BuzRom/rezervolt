"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Container } from "@/components/ui/container";

type Stat = { value: number; suffix: string; label: string };

export function Stats() {
  const t = useTranslations("Stats");
  const items = t.raw("items") as Stat[];
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-counter]");
      els.forEach((el) => {
        const end = Number(el.dataset.value);
        if (reduced) {
          el.textContent = String(end);
          return;
        }
        const obj = { v: 0 };
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
    },
    { scope: root, dependencies: [reduced] },
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
                {/* The hidden final value reserves the counter's width, so counting up from 0
                    can't re-wrap the line (e.g. "24 МВт" on phones) and shift the page mid-scroll. */}
                <span className="inline-grid tabular-nums">
                  <span aria-hidden className="invisible col-start-1 row-start-1">
                    {stat.value}
                  </span>
                  <span
                    data-counter
                    data-value={stat.value}
                    className="col-start-1 row-start-1"
                  >
                    0
                  </span>
                </span>
                <span className="text-gradient">{stat.suffix}</span>
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
