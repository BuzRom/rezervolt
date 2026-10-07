"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroScene } from "./hero-scene";

function Precompile({ onDone }: { onDone: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let active = true;
    gl.compileAsync(scene, camera)
      .catch(() => {})
      .then(() => active && onDone());
    return () => {
      active = false;
    };
  }, [gl, scene, camera, onDone]);

  return null;
}

function KeepClock() {
  const elapsed = useRef(0);

  useFrame((state) => {
    const { clock } = state;
    if (state.frameloop === "never" || clock.elapsedTime < elapsed.current) {
      clock.elapsedTime = elapsed.current;
    } else {
      elapsed.current = clock.elapsedTime;
    }
  }, -1);

  return null;
}

function FirstFrames({ onPainted }: { onPainted: () => void }) {
  const frames = useRef(0);

  useFrame((state) => {
    if (state.frameloop !== "always" || frames.current >= 2) return;
    frames.current += 1;
    if (frames.current === 2) onPainted();
  });

  return null;
}

export default function HeroCanvas({
  visible,
  onReady,
}: {
  visible: boolean;
  onReady: (ready: boolean) => void;
}) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const wrap = useRef<HTMLDivElement>(null);
  const [compiled, setCompiled] = useState(false);
  const [painted, setPainted] = useState(false);
  const [lost, setLost] = useState(false);
  const [inView, setInView] = useState(true);
  const markCompiled = useCallback(() => setCompiled(true), []);
  const markPainted = useCallback(() => setPainted(true), []);
  const live = compiled && painted && !lost;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onReady(live);
  }, [live, onReady]);

  useEffect(() => () => onReady(false), [onReady]);

  return (
    <div
      ref={wrap}
      className={cn("absolute inset-0", visible ? "opacity-100" : "opacity-0")}
    >
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 2]}
        frameloop={compiled && inView && !lost ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "default",
        }}
        camera={{ position: [0, 0, 7], fov: 38 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setLost(true);
          });
        }}
      >
        <HeroScene dark={dark} />
        <KeepClock />
        <FirstFrames onPainted={markPainted} />
        <Precompile onDone={markCompiled} />
      </Canvas>
    </div>
  );
}
