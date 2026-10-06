import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CalculatorPanel } from "@/components/calculator/calculator-panel";
import { getDamStats } from "@/lib/dam-data";

export async function Calculator() {
  const [t, dam] = await Promise.all([getTranslations("Calculator"), getDamStats()]);

  return (
    <section id="calculator" className="relative py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/50 p-6 sm:p-10 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-solar-500/15 blur-3xl"
          />
          <div className="relative">
            <SectionHeading
              align="left"
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <div className="mt-10">
              <CalculatorPanel dam={dam} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
