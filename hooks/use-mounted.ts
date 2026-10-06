"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Returns `false` on the server / first render, `true` after hydration. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
