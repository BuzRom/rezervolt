"use client";

import { useMediaQuery } from "./use-media-query";

/** Reactively tracks the user's reduced-motion preference. SSR-safe (defaults to false). */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
