"use client";

import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type Item = { quote: string; name: string; role: string };

function Card({ item }: { item: Item }) {
  return (
    <figure className="flex w-[20rem] shrink-0 flex-col rounded-2xl border border-border bg-card/50 p-7 sm:w-[24rem]">
      <Quote className="h-7 w-7 text-solar-500/60" />
      <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
        “{item.quote}”
      </blockquote>
      <div className="mt-5 flex items-center gap-1 text-solar-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <figcaption className="mt-4">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-muted-foreground">{item.role}</div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const items = t.raw("items") as Item[];
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      </Container>

      {reduced ? (
        <Container className="mt-14">
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        </Container>
      ) : (
        <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className={cn(
              "flex w-max gap-6 pr-6 animate-marquee group-hover:[animation-play-state:paused]",
            )}
          >
            {[...items, ...items, ...items, ...items, ...items, ...items].map(
              (item, i) => (
                <Card key={i} item={item} />
              ),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
