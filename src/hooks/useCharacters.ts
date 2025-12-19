"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Character } from "@/types/domain";
import { listCharacters, searchCharacters } from "@/api/comicvine";
import { useGlobalLoading } from "@/features/loading/LoadingContext";

type State = {
  items: Character[];
  total: number;
  isLoading: boolean; // local skeleton
  error: string | null;
};

export function useCharacters(query: string) {
  const { start, stop } = useGlobalLoading();

  const [state, setState] = useState<State>({
    items: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  const q = useMemo(() => query.trim(), [query]);
  const timer = useRef<number | null>(null);
  const reqId = useRef(0);

  useEffect(() => {
    // Local loading starts immediately (skeleton), but global red line should wait
    // until the actual request starts (after debounce).
    setState((s) => ({ ...s, isLoading: true, error: null }));

    if (timer.current) window.clearTimeout(timer.current);

    const myReqId = ++reqId.current;

    timer.current = window.setTimeout(async () => {
      // Request starts now -> show global loading (red line)
      start();

      try {
        const res = q ? await searchCharacters(q, 50) : await listCharacters(50);

        // Ignore stale responses
        if (myReqId !== reqId.current) return;

        setState({
          items: res.items,
          total: res.total,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        if (myReqId !== reqId.current) return;

        setState({
          items: [],
          total: 0,
          isLoading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      } finally {
        // Only the latest request is allowed to stop global loading
        if (myReqId === reqId.current) stop();
      }
    }, 350);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      // Don't stop global loading here; only stop in the latest request's finally.
    };
  }, [q, start, stop]);

  return state;
}
