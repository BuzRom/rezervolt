"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

export function Navbar() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const header = toggleRef.current?.closest("header") ?? null;
    const outside = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.contains(header),
    );
    document.body.style.overflow = "hidden";
    outside.forEach((el) => {
      el.inert = true;
    });
    menuRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      outside.forEach((el) => {
        el.inert = false;
      });
    };
  }, [open]);

  return (
    <header
      data-site-header
      data-lenis-prevent={open ? "" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[var(--header-h,4.5rem)] border-b border-border bg-background transition-shadow duration-500",
        scrolled && "shadow-soft",
      )}
    >
      <div className="relative z-50 mx-auto h-full w-full max-w-7xl px-5 py-3 sm:px-8 lg:px-12">
        <nav className="flex h-full items-center justify-between gap-4">
          <a href="#top" aria-label={site.name} className="flex shrink-0 items-center">
            <Logo />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="rounded-full px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden sm:inline-flex" />
            <ThemeToggle />
            <Magnetic className="hidden md:inline-block">
              <Button
                href="#contact"
                size="md"
                className="shadow-[0_6px_18px_-8px_rgb(var(--glow)/0.55)] hover:shadow-[0_8px_22px_-8px_rgb(var(--glow)/0.7)]"
              >
                {t("cta")}
              </Button>
            </Magnetic>
            <button
              ref={toggleRef}
              type="button"
              aria-label={t("menu")}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <div
        id={menuId}
        ref={menuRef}
        inert={!open}
        className={cn(
          "fixed inset-0 top-0 z-40 bg-background/95 backdrop-blur-xl duration-300 lg:hidden",
          open
            ? "visible opacity-100 transition-opacity"
            : "invisible opacity-0 transition-[opacity,visibility]",
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-medium text-foreground"
            >
              {t(link.labelKey)}
            </a>
          ))}
          <div className="mt-4 flex items-center gap-3">
            <LocaleSwitcher />
          </div>
          <Button href="#contact" size="lg" onClick={() => setOpen(false)}>
            {t("cta")}
          </Button>
        </div>
      </div>
    </header>
  );
}
