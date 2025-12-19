"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Character } from "@/types/domain";
import { listCharacters, searchCharacters } from "@/api/comicvine";
import { useGlobalLoading } from "@/features/loading/LoadingContext";

type State = {
  items: Character[];
  total: number;
  isLoading: boolean;
  error: string | null;
};

/**
 * useCharacters
 * - Loads the initial list (50 items).
 * - Search is debounced to reduce requests (rate limit friendly).
 * - Also toggles a global loading indicator (header red line).
 */
export function useCharacters(query: string) {
  const { setLoading } = useGlobalLoading();

  const [state, setState] = useState<State>({
    items: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  const q = useMemo(() => query.trim(), [query]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    setLoading(true);

    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(async () => {
      try {
        const res = q ? await searchCharacters(q, 50) : await listCharacters(50);
        setState({
          items: res.items,
          total: res.total,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        setState({
          items: [],
          total: 0,
          isLoading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q, setLoading]);

  return state;
}