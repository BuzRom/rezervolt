import Image from "next/image";
import { cn } from "@/lib/utils";
import posterDark from "@/assets/hero/panel-dark.webp";
import posterLight from "@/assets/hero/panel-light.webp";

const sizes =
  "(min-width: 1280px) 580px, (min-width: 1024px) 45vw, (min-width: 640px) 544px, calc(100vw - 40px)";

export function HeroPoster({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <Image
        src={posterDark}
        alt=""
        fill
        sizes={sizes}
        fetchPriority="high"
        className="hidden object-contain dark:block"
      />
      <Image
        src={posterLight}
        alt=""
        fill
        sizes={sizes}
        fetchPriority="high"
        className="object-contain dark:hidden"
      />
    </div>
  );
}
