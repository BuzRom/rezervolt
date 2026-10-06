"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Theme");
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? t("toLight") : t("toDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-foreground/80 transition-colors hover:text-foreground hover:border-solar-500/50",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          mounted && isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          mounted && !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}
