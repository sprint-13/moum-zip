"use client";

import { createContext, use } from "react";
import type { SpaceContext } from "./get-space-context";

const SpaceCtx = createContext<SpaceContext | null>(null);

export function SpaceProvider({ value, children }: { value: SpaceContext; children: React.ReactNode }) {
  return <SpaceCtx.Provider value={value}>{children}</SpaceCtx.Provider>;
}

export function useSpaceContext(): SpaceContext {
  const ctx = use(SpaceCtx);
  if (!ctx) throw new Error("useSpaceContext must be used within SpaceProvider");
  return ctx;
}
