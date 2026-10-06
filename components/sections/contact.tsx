"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Info, Mail, MapPin, Phone, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { hiddenContacts, site } from "@/lib/site";

export function Contact() {
  const t = useTranslations("Contact");
  const locale = useLocale() as "uk" | "en";
  const [submitted, setSubmitted] = useState(false);

  const details = [
    { id: "phone", icon: Phone, label: t("phoneLabel"), value: site.phone, href: `tel:${site.phoneHref}` },
    { id: "email", icon: Mail, label: t("emailLabel"), value: site.email, href: `mailto:${site.email}` },
    { id: "address", icon: MapPin, label: t("addressLabel"), value: site.address[locale] },
    { id: "hours", icon: Clock, label: t("hoursLabel"), value: t("hours") },
  ].filter((d) => !hiddenContacts.has(d.id));

  const inputCls =
    "h-12 w-full rounded-xl border border-input bg-background/70 px-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-solar-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {details.map((d) => {
                const content = (
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-solar-500/40">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-solar-400/20 to-solar-600/20 text-solar-600 ring-1 ring-solar-500/20 dark:text-solar-400">
                      <d.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {d.label}
                      </div>
                      <div className="truncate font-medium">{d.value}</div>
                    </div>
                  </div>
                );
                return (
                  <li key={d.label}>
                    {d.href ? <a href={d.href}>{content}</a> : content}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card/50 p-7 sm:p-9">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  required
                  placeholder={t("form.name")}
                  aria-label={t("form.name")}
                  className={inputCls}
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("form.phone")}
                  aria-label={t("form.phone")}
                  className={inputCls}
                />
              </div>
              <textarea
                name="message"
                rows={4}
                placeholder={t("form.message")}
                aria-label={t("form.message")}
                className={`${inputCls} h-auto resize-none py-3`}
              />

              <Button type="submit" size="lg" className="w-full">
                {t("form.submit")}
                <Send className="h-4 w-4" />
              </Button>

              {submitted && (
                <p className="flex items-start gap-2 rounded-xl border border-solar-500/30 bg-solar-500/10 p-3 text-sm text-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-solar-500" />
                  {t("form.soon")}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground">
                {t("form.note")}
              </p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
