"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PanelPoster } from "./panel-poster";

// Load the WebGL canvas only on the client, with the CSS poster as the loader.
const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => <PanelPoster />,
});

/**
 * Decides whether to render the live 3D scene or the static poster.
 * Heavy WebGL is skipped on small screens and for reduced-motion users.
 */
export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  const smallScreen = useMediaQuery("(max-width: 768px)");
  const enable3d = !reduced && !smallScreen;

  if (!enable3d) return <PanelPoster />;
  return <HeroCanvas />;
}
