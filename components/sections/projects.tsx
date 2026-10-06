"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Project = {
  title: string;
  location: string;
  power: string;
  desc: string;
};

const GRADIENTS = [
  "from-amber-500/30 via-orange-500/20 to-rose-500/10",
  "from-sky-500/30 via-cyan-500/20 to-emerald-500/10",
  "from-violet-500/30 via-fuchsia-500/20 to-amber-500/10",
  "from-emerald-500/30 via-teal-500/20 to-sky-500/10",
];

export function Projects() {
  const t = useTranslations("Projects");
  const items = t.raw("items") as Project[];

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Reveal stagger={0.1} className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((p, i) => (
            <article
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-solar-500/40 hover:shadow-soft"
            >
              <div
                className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
              >
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div
                  aria-hidden
                  className="absolute inset-0 [transform:perspective(700px)_rotateX(40deg)] [transform-origin:bottom] opacity-50 transition-transform duration-700 group-hover:[transform:perspective(700px)_rotateX(34deg)_scale(1.05)]"
                >
                  <div className="absolute bottom-0 left-1/2 grid -translate-x-1/2 grid-cols-8 gap-1 p-4">
                    {Array.from({ length: 32 }).map((_, c) => (
                      <div
                        key={c}
                        className="aspect-square w-5 rounded-[2px] bg-[#0a1c3a]/70 ring-1 ring-white/10"
                      />
                    ))}
                  </div>
                </div>
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-sm font-semibold backdrop-blur">
                  <Zap className="h-3.5 w-3.5 text-solar-500" />
                  {p.power}
                </span>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-solar-500" />
                  {p.location}
                </div>
                <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold">
                  {p.title}
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-solar-500" />
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </Reveal>

        <div className="mt-12 flex justify-center">
          <Button href="#contact" variant="outline" size="lg">
            {t("cta")}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
