import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { hiddenSections, site, siteUrl } from "@/lib/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BackToTop } from "@/components/layout/back-to-top";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { WhyUs } from "@/components/sections/why-us";
import { Equipment } from "@/components/sections/equipment";
import { Projects } from "@/components/sections/projects";
import { Calculator } from "@/components/sections/calculator";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

// Re-render twice a day to pick up fresh day-ahead market prices for the calculator.
export const revalidate = 43200;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "Meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: t("description"),
    url: siteUrl,
    email: site.email,
    telephone: site.phone,
    areaServed: "UA",
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Calculator />
        <Equipment />
        <Stats />
        <Services />
        <Process />
        <WhyUs />
        {!hiddenSections.has("projects") && <Projects />}
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
