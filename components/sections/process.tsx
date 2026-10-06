"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  FileCheck2,
  HardHat,
  LineChart,
  PencilRuler,
  PlugZap,
  Search,
  type LucideIcon,
} from "lucide-react";
import { gsap, headerHeight, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { title: string; desc: string };

const ICONS: LucideIcon[] = [
  Search,
  PencilRuler,
  FileCheck2,
  HardHat,
  PlugZap,
  LineChart,
];

const CELL_COUNT = 48;

export function Process() {
  const t = useTranslations("Process");
  const steps = t.raw("steps") as Step[];
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const pin = root.current!.querySelector<HTMLElement>("[data-pin]")!;
        const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]");
        const cells = gsap.utils.toArray<HTMLElement>("[data-cell]");
        const bigNum = root.current!.querySelector<HTMLElement>("[data-bignum]")!;
        const iconEls = gsap.utils.toArray<HTMLElement>("[data-pic]");
        const total = stepEls.length;

        const setActive = (idx: number, progress: number) => {
          stepEls.forEach((el, i) =>
            el.setAttribute("data-active", String(i === idx)),
          );
          iconEls.forEach((el, i) =>
            el.setAttribute("data-active", String(i === idx)),
          );
          const lit = Math.round(progress * cells.length);
          cells.forEach((c, i) => c.setAttribute("data-lit", i < lit ? "1" : "0"));
          bigNum.textContent = String(idx + 1).padStart(2, "0");
        };

        const st = ScrollTrigger.create({
          trigger: pin,
          start: () => `top top+=${headerHeight()}`,
          end: `+=${total * 28}%`,
          pin: true,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            setActive(idx, self.progress);
          },
        });

        setActive(0, 0);
        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="process"
      ref={root}
      className="relative py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </Container>

      <div className="mt-6 hidden lg:block">
        <div
          data-pin
          className="relative flex min-h-[calc(100dvh-var(--header-h,4.5rem))] items-center py-6"
        >
          <Container>
            <div className="grid grid-cols-2 items-center gap-14">
              <div className="relative flex items-center justify-center">
                <div
                  data-bignum
                  className="pointer-events-none absolute -left-2 -top-10 font-display text-[10rem] font-bold leading-none text-foreground/[0.05]"
                >
                  01
                </div>

                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute -inset-10 rounded-full bg-solar-500/10 blur-3xl"
                  />
                  <div className="relative grid grid-cols-6 gap-1.5 rounded-xl border-4 border-slate-400/40 bg-[#0a1c3a] p-3 shadow-soft [transform:perspective(1100px)_rotateX(8deg)_rotateY(-14deg)]">
                    {Array.from({ length: CELL_COUNT }).map((_, i) => (
                      <div
                        key={i}
                        data-cell
                        data-lit="0"
                        className="aspect-square rounded-[3px] bg-gradient-to-br from-[#13315c] to-[#091a36] transition-all duration-500 data-[lit=1]:from-solar-300 data-[lit=1]:to-solar-600 data-[lit=1]:shadow-[0_0_12px_-2px_rgb(var(--glow)/0.8)]"
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center gap-2.5">
                    {steps.map((_, i) => {
                      const Icon = ICONS[i % ICONS.length];
                      return (
                        <span
                          key={i}
                          data-pic
                          data-active={i === 0}
                          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/50 text-muted-foreground transition-colors duration-300 data-[active=true]:border-solar-500/60 data-[active=true]:bg-solar-500/15 data-[active=true]:text-solar-500"
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    data-step
                    data-active={i === 0}
                    className="group/step rounded-2xl border border-border bg-card/30 px-5 py-4 opacity-50 transition-all duration-300 data-[active=true]:border-solar-500/40 data-[active=true]:bg-card data-[active=true]:opacity-100 data-[active=true]:shadow-soft"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-xl font-bold text-gradient">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-snug text-muted-foreground [@media(max-height:820px)]:hidden [@media(max-height:820px)]:group-data-[active=true]/step:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="mt-12 lg:hidden">
        <ol className="space-y-6">
          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={i}
                className="relative pl-14 after:absolute after:-bottom-9 after:left-[17.5px] after:top-12 after:w-px after:bg-gradient-to-b after:from-solar-500/50 after:to-border last:after:hidden"
              >
                <span className="absolute left-0 top-3 grid h-9 w-9 place-items-center rounded-full border border-solar-500/40 bg-background bg-gradient-to-br from-solar-400/20 to-solar-600/20 text-solar-500">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="rounded-2xl border border-border bg-card/40 p-5">
                  <h3 className="font-semibold">
                    <span className="mr-2 text-gradient">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
