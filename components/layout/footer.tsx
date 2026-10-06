import { useTranslations, useLocale } from "next-intl";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { hiddenContacts, navLinks, site } from "@/lib/site";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale() as "uk" | "en";

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-solar-500/10 blur-3xl"
      />
      <Container className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-pretty text-muted-foreground">
              {t("Footer.tagline")}
            </p>
            {!hiddenContacts.has("socials") && (
              <div className="mt-6 flex flex-wrap gap-3">
                {Object.entries(site.socials).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card/40 px-4 py-1.5 text-sm capitalize text-foreground/70 transition-colors hover:border-solar-500/50 hover:text-foreground"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("Footer.navTitle")}
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(`Nav.${link.labelKey}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("Footer.contactsTitle")}
            </h3>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-solar-500" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-solar-500" />
                  {site.email}
                </a>
              </li>
              {!hiddenContacts.has("address") && (
                <li className="inline-flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-solar-500" />
                  {site.address[locale]}
                </li>
              )}
              {!hiddenContacts.has("hours") && (
                <li className="inline-flex items-center gap-3">
                  <Clock className="h-4 w-4 text-solar-500" />
                  {t("Contact.hours")}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. {t("Footer.rights")}
          </p>
          <p>{t("Footer.madeWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
