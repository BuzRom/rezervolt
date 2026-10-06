import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Nav");
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-gradient">404</p>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-gradient-to-br from-solar-400 to-solar-600 px-6 text-sm font-medium text-primary-foreground"
        >
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
