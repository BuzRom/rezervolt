"use client";

import { Environment, Float, Lightformer, ContactShadows } from "@react-three/drei";
import { SolarPanel } from "./solar-panel";

export function HeroScene({ dark }: { dark: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.35 : 0.8} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={dark ? 2.4 : 3}
        color={dark ? "#ffd29a" : "#fff3df"}
      />
      <pointLight
        position={[-4, -1, 3]}
        intensity={dark ? 18 : 10}
        color="#f59e0b"
        distance={14}
      />

      {/* The "sun" — a soft emissive glow behind the panel */}
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[1.7, 1.4, -2.5]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshBasicMaterial color={dark ? "#fbbf24" : "#fcd34d"} />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.7}>
        <SolarPanel />
      </Float>

      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={dark ? 0.55 : 0.35}
        scale={14}
        blur={3.2}
        far={4.5}
        color={dark ? "#000000" : "#3a2a10"}
      />

      {/* Procedural studio environment for glassy reflections (no external HDRI). */}
      <Environment resolution={256}>
        <Lightformer
          intensity={dark ? 1.4 : 2}
          position={[0, 4, 2]}
          scale={[10, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={2.2}
          position={[-3, 1, 3]}
          scale={[3, 6, 1]}
          color="#f59e0b"
        />
        <Lightformer
          intensity={1.6}
          position={[3, -1, 2]}
          scale={[4, 4, 1]}
          color={dark ? "#1e3a5f" : "#7dd3fc"}
        />
      </Environment>
    </>
  );
}
