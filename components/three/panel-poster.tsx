import { cn } from "@/lib/utils";

export function PanelPoster({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center overflow-hidden", className)}>
      <div className="absolute h-72 w-72 rounded-full bg-solar-500/25 blur-3xl" />
      <div className="absolute right-[20%] top-[22%] h-28 w-28 rounded-full bg-gradient-to-br from-solar-300 to-solar-500 blur-md opacity-80" />
      <div className="relative [perspective:1200px]">
        <div className="animate-float grid grid-cols-6 gap-1.5 rounded-md border-4 border-slate-300/70 bg-[#0a1c3a] p-2 shadow-2xl [transform:rotateX(12deg)_rotateY(-18deg)]">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square w-8 rounded-[2px] bg-gradient-to-br from-[#13315c] to-[#091a36] sm:w-9"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
