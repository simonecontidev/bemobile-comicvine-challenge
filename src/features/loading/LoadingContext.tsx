// src/features/loading/LoadingContext.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type LoadingContextValue = {
  isLoading: boolean;
  start: () => void;
  stop: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize actions so their identity stays stable across renders.
  // This prevents effects that depend on start/stop from re-running
  // when isLoading toggles.
  const start = useCallback(() => setIsLoading(true), []);
  const stop = useCallback(() => setIsLoading(false), []);

  const value = useMemo(() => ({ isLoading, start, stop }), [isLoading, start, stop]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useGlobalLoading must be used within LoadingProvider");
  return ctx;
}
