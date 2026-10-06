"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import type { WebGLRenderer } from "three";
import { HeroScene } from "./hero-scene";

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const glRef = useRef<WebGLRenderer | null>(null);

  // Browsers cap simultaneous WebGL contexts (~16). Fast Refresh / route
  // changes remount the Canvas, so we free the context eagerly on unmount —
  // otherwise contexts leak until the browser blocks new ones.
  useEffect(() => {
    return () => {
      glRef.current?.forceContextLoss();
      glRef.current?.dispose();
      glRef.current = null;
    };
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 7], fov: 38 }}
      onCreated={({ gl }) => {
        glRef.current = gl;
        // A lost context should not bubble up as an unhandled console error.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false,
        );
      }}
    >
      <HeroScene dark={dark} />
    </Canvas>
  );
}
