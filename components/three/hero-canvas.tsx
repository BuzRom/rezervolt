"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { HeroScene } from "./hero-scene";

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

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
