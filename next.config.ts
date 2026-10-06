import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // three.js / drei ship modern ESM; transpiling avoids edge-case parse issues.
  transpilePackages: ["three"],
  // Pin the workspace root (there are other lockfiles higher up the tree).
  turbopack: { root: import.meta.dirname },
};

export default withNextIntl(nextConfig);
