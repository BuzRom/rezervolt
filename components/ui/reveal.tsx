"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, MOTION_REDUCE, useGSAP } from "@/lib/gsap";
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

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;

      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCE, () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        if (el.getBoundingClientRect().top < innerHeight * 0.85) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(targets, { opacity: 0, y });

        const show = contextSafe(() => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            stagger: stagger ?? 0,
          });
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            const passed = entry.boundingClientRect.top < (entry.rootBounds?.bottom ?? innerHeight);
            if (!entry.isIntersecting && !passed) return;
            observer.disconnect();
            show();
          },
          { rootMargin: "0px 0px -15% 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
      });
    },
    { scope: ref },
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
