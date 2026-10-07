import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — Rezervolt",
};

export default function GlobalNotFound() {
  return (
    <html lang="uk" className={`dark ${inter.variable} ${unbounded.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <main className="grid min-h-dvh place-items-center px-6 text-center">
          <div>
            <p className="font-display text-7xl font-bold text-gradient">404</p>
            <p className="mt-4 text-muted-foreground">Сторінку не знайдено · Page not found</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/uk"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-br from-solar-400 to-solar-600 px-6 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                На головну
              </Link>
              <Link
                href="/en"
                className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
