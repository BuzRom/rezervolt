"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = { uk: "UA", en: "EN" };

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/40 p-0.5",
        className,
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending || l === locale}
          aria-current={l === locale}
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: l }))
          }
          className={cn(
            "h-8 rounded-full px-2.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            l === locale
              ? "bg-gradient-to-br from-solar-400 to-solar-600 text-primary-foreground"
              : "text-foreground/70 hover:text-foreground",
          )}
        >
          {LABEL[l] ?? l}
        </button>
      ))}
    </div>
  );
}
