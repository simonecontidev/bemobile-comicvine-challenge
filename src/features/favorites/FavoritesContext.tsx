"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type FavoritesState = {
  ids: Set<number>;
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  count: number;
};

const FavoritesContext = createContext<FavoritesState | null>(null);
const STORAGE_KEY = "bemobile:favorites:v1";

/**
 * FavoritesProvider
 * - Stores favorite character IDs in a Set for O(1) lookups.
 * - Persists to localStorage to keep favorites across refreshes.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(new Set());

  // Load favorites from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: number[] = JSON.parse(raw);
      setIds(new Set(parsed));
    } catch {
      // Ignore invalid/corrupted storage data
    }
  }, []);

  // Persist favorites whenever IDs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  }, [ids]);

  const value = useMemo<FavoritesState>(() => {
    const toggle = (id: number) => {
      setIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    return {
      ids,
      toggle,
      isFavorite: (id) => ids.has(id),
      count: ids.size,
    };
  }, [ids]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}