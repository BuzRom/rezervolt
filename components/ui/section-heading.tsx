import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-solar-700 dark:text-solar-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-solar-400 to-solar-600" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05} className="mt-5">
        <h2 className="max-w-3xl text-balance text-3xl font-semibold sm:text-4xl lg:text-[2.9rem] lg:leading-[1.07]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal
          delay={0.1}
          className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          {subtitle}
        </Reveal>
      )}
    </div>
  );
}
