import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const COLS = 6;
const ROWS = 8;
const LIT_ROWS = 3;

async function messages(locale: string) {
  const known = routing.locales.includes(locale as Locale) ? locale : routing.defaultLocale;
  return (await import(`@/messages/${known}.json`)).default;
}

function Sun({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ea7a0c" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="7" fill="url(#sun)" />
      <path
        stroke="url(#sun)"
        strokeWidth="2.6"
        strokeLinecap="round"
        d="M16 2.5v3.5M16 26v3.5M2.5 16h3.5M26 16h3.5M6.45 6.45l2.47 2.47M23.08 23.08l2.47 2.47M6.45 25.55l2.47-2.47M23.08 8.92l2.47-2.47"
      />
    </svg>
  );
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { Hero } = await messages(locale);
  const [display, text] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Unbounded-Bold.woff")),
    readFile(join(process.cwd(), "assets/fonts/Inter-Medium.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0e16",
          color: "#ece9e3",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 0% 0%, rgba(245,158,11,0.26), transparent 55%), radial-gradient(circle at 100% 100%, rgba(45,212,191,0.14), transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 720,
            padding: "64px 0 60px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Sun px={48} />
            <div style={{ fontFamily: "Unbounded", fontSize: 30, letterSpacing: -0.5 }}>
              {site.name}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Unbounded",
              fontSize: 58,
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            <div style={{ display: "flex" }}>{Hero.titleLead}</div>
            <div style={{ display: "flex", color: "#fbbf24" }}>{Hero.titleHighlight}</div>
            <div style={{ display: "flex" }}>{Hero.titleTail}</div>
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid #2b3549",
              backgroundColor: "rgba(17,23,38,0.8)",
              color: "#fbbf24",
              fontSize: 19,
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: "#f59e0b" }} />
            {Hero.badge}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 70,
              right: 92,
              width: 150,
              height: 150,
              borderRadius: 999,
              backgroundImage: "linear-gradient(135deg, #fcd34d, #f59e0b)",
              boxShadow: "0 0 120px 40px rgba(251,191,36,0.35)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: 10,
              borderRadius: 12,
              border: "6px solid rgba(203,213,225,0.7)",
              backgroundColor: "#0a1c3a",
              boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
              transform: "rotate(-8deg)",
            }}
          >
            {Array.from({ length: ROWS }).map((_, row) => (
              <div key={row} style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: COLS }).map((__, col) => (
                  <div
                    key={col}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 3,
                      backgroundImage:
                        row >= ROWS - LIT_ROWS
                          ? "linear-gradient(135deg, #fcd34d, #ea7a0c)"
                          : "linear-gradient(135deg, #13315c, #091a36)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: display, weight: 700, style: "normal" },
        { name: "Inter", data: text, weight: 500, style: "normal" },
      ],
    },
  );
}
