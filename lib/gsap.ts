"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function headerHeight() {
  return document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
}

export { gsap, ScrollTrigger, useGSAP };
