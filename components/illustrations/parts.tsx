import { useId } from "react";

/** url()-safe id prefix for gradients/filters — several illustrations share one page. */
export function useSvgId() {
  return useId().replace(/[^\w-]/g, "");
}

/**
 * Fakes the depth of a front-facing box: copies of its outline stacked back along (dx, dy),
 * one user unit apart, so the visible top/side read as a solid extruded body.
 * Draw the front face on top of it.
 */
export function Depth({
  x,
  y,
  width,
  height,
  rx = 0,
  dx,
  dy,
  fill,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  dx: number;
  dy: number;
  fill: string;
}) {
  const steps = Math.ceil(Math.hypot(dx, dy));
  return (
    <g fill={fill}>
      {Array.from({ length: steps }, (_, i) => {
        const k = 1 - i / steps;
        return (
          <rect
            key={i}
            x={x + dx * k}
            y={y + dy * k}
            width={width}
            height={height}
            rx={rx}
          />
        );
      })}
    </g>
  );
}
