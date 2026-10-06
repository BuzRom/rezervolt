"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div
      ref={ref}
      className={cn(className)}
      {...(stagger ? {} : { "data-anim": "hidden" })}
    >
      {children}
    </div>
  );
}
