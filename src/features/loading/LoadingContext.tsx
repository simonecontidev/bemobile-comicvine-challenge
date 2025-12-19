"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type LoadingState = {
  isLoading: boolean;
  setLoading: (v: boolean) => void;
};

const LoadingContext = createContext<LoadingState | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({
      isLoading,
      setLoading: setIsLoading,
    }),
    [isLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useGlobalLoading must be used within LoadingProvider");
  return ctx;
}