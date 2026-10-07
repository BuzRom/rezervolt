"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function useCellTexture() {
  return useMemo(() => {
    const w = 620;
    const h = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0a1c3a";
    ctx.fillRect(0, 0, w, h);

    const cols = 6;
    const rows = 10;
    const pad = 16;
    const gap = 8;
    const cellW = (w - pad * 2 - gap * (cols - 1)) / cols;
    const cellH = (h - pad * 2 - gap * (rows - 1)) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = pad + c * (cellW + gap);
        const y = pad + r * (cellH + gap);
        const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
        grad.addColorStop(0, "#13315c");
        grad.addColorStop(0.5, "#0c2347");
        grad.addColorStop(1, "#091a36");
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, cellW, cellH);

        ctx.strokeStyle = "rgba(190,205,225,0.22)";
        ctx.lineWidth = 1.5;
        for (let b = 1; b <= 2; b++) {
          const bx = x + (cellW * b) / 3;
          ctx.beginPath();
          ctx.moveTo(bx, y);
          ctx.lineTo(bx, y + cellH);
          ctx.stroke();
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

export function SolarPanel(props: React.ComponentProps<"group">) {
  const group = useRef<THREE.Group>(null);
  const cells = useCellTexture();

  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    target.current.y = state.pointer.x * 0.4 + Math.sin(t * 0.3) * 0.18;
    target.current.x = -state.pointer.y * 0.25 + Math.cos(t * 0.24) * 0.06;
    const damp = 1 - Math.pow(0.0015, delta);
    g.rotation.y += (target.current.y - g.rotation.y) * damp;
    g.rotation.x += (target.current.x + 0.12 - g.rotation.x) * damp;
  });

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c9ccd2",
        metalness: 0.95,
        roughness: 0.28,
      }),
    [],
  );

  const W = 3.05;
  const H = 4.9 / 2.5;
  const fw = 0.07;

  return (
    <group ref={group} rotation={[0.18, 0, 0]} {...props} scale={1.05}>
      <mesh castShadow>
        <boxGeometry args={[W, H, 0.05]} />
        <meshPhysicalMaterial
          map={cells}
          metalness={0.1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.4}
          reflectivity={0.6}
        />
      </mesh>

      <mesh position={[0, H / 2 + fw / 2, 0]} material={frameMat}>
        <boxGeometry args={[W + fw * 2, fw, 0.12]} />
      </mesh>
      <mesh position={[0, -H / 2 - fw / 2, 0]} material={frameMat}>
        <boxGeometry args={[W + fw * 2, fw, 0.12]} />
      </mesh>
      <mesh position={[-W / 2 - fw / 2, 0, 0]} material={frameMat}>
        <boxGeometry args={[fw, H, 0.12]} />
      </mesh>
      <mesh position={[W / 2 + fw / 2, 0, 0]} material={frameMat}>
        <boxGeometry args={[fw, H, 0.12]} />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[W, H, 0.04]} />
        <meshStandardMaterial color="#0c1320" metalness={0.4} roughness={0.7} />
      </mesh>
    </group>
  );
}
