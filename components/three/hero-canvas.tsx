"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { HeroScene } from "./hero-scene";

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  // No manual dispose on unmount: R3F unmounts the scene first and then calls
  // forceContextLoss() itself, so the WebGL context is still freed. Disposing the
  // renderer earlier made drei's <Environment> crash in its own cleanup
  // (render-target dispose on an already-disposed renderer, e.g. on locale switch).
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
