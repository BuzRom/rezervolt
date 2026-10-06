"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { PanelPoster } from "./panel-poster";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function whenIdle(run: () => void) {
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if ("requestIdleCallback" in window) idleId = requestIdleCallback(run, { timeout: 1500 });
    else timer = setTimeout(run, 300);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) cancelIdleCallback(idleId);
    clearTimeout(timer);
  };
}

export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  const smallScreen = useMediaQuery("(max-width: 768px)");
  const enable3d = !reduced && !smallScreen;
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enable3d) return;
    return whenIdle(() => setIdle(true));
  }, [enable3d]);

  const show3d = enable3d && idle;

  return (
    <>
      <PanelPoster
        className={cn(
          "transition-[opacity,visibility] duration-700",
          show3d && ready && "invisible opacity-0",
        )}
      />
      {show3d && (
        <SceneBoundary>
          <HeroCanvas onReady={setReady} />
        </SceneBoundary>
      )}
    </>
  );
}
