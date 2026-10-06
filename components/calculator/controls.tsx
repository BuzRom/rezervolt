"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function StepSlider({
  label,
  steps,
  value,
  onChange,
  display,
  hint,
}: {
  label: string;
  steps: number[];
  value: number;
  onChange: (value: number) => void;
  display: string;
  hint?: React.ReactNode;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-sm font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display text-xl font-bold text-gradient">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={Math.max(0, steps.indexOf(value))}
        onChange={(e) => onChange(steps[Number(e.target.value)])}
        aria-valuetext={display}
        className="mt-4 w-full cursor-pointer accent-solar-500"
      />
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  hideLabel,
  stretch,
  className,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  hideLabel?: boolean;
  stretch?: boolean;
  className?: string;
}) {
  const name = useId();

  return (
    <fieldset className={className}>
      <legend
        className={cn("mb-3 text-sm font-medium text-muted-foreground", hideLabel && "sr-only")}
      >
        {label}
      </legend>
      <div
        className={cn(
          "inline-flex gap-1 rounded-full border border-border bg-background/60 p-1",
          stretch && "flex w-full sm:inline-flex sm:w-auto",
        )}
      >
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-center text-sm font-medium leading-tight transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                stretch && "flex-1 px-3 sm:flex-none sm:px-4",
                checked
                  ? "bg-gradient-to-br from-solar-400 to-solar-600 text-primary-foreground shadow-[0_6px_20px_-8px_rgb(var(--glow)/0.6)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
