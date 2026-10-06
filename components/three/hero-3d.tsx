"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PanelPoster } from "./panel-poster";

const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => <PanelPoster />,
});

export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  const smallScreen = useMediaQuery("(max-width: 768px)");
  const enable3d = !reduced && !smallScreen;

  if (!enable3d) return <PanelPoster />;
  return <HeroCanvas />;
}
