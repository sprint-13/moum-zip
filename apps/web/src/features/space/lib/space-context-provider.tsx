"use client";

import { createContext, type RefObject, use, useRef, useState } from "react";
import type { SpaceContext } from "./get-space-context";

type SpaceContextType = SpaceContext & { container: HTMLDivElement | null };

const SpaceCtx = createContext<SpaceContextType | null>(null);

export function SpaceProvider({ value, children }: { value: SpaceContext; children: React.ReactNode }) {
  "use memo";
  // const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const ctxValue: SpaceContextType = {
    ...value,
    container,
  };

  return (
    <SpaceCtx.Provider value={ctxValue}>
      <div ref={setContainer} className={value.space.themeColor}>
        {children}
      </div>
    </SpaceCtx.Provider>
  );
}

export function useSpaceContext(): SpaceContextType {
  const ctx = use(SpaceCtx);
  if (!ctx) throw new Error("useSpaceContext must be used within SpaceProvider");
  return ctx;
}
