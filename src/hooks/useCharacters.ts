"use client";

import { useEffect, useMemo, useState } from "react";
import type { Character } from "@/types/domain";
import { listCharacters, searchCharacters } from "@/api/comicvine";
import { useGlobalLoading } from "@/features/loading/LoadingContext";

type UseCharactersResult = {
  items: Character[];
  total: number;
  isLoading: boolean;
  error: string | null;
};

export function useCharacters(query: string, debounceMs = 350): UseCharactersResult {
  const { setLoading } = useGlobalLoading();

  const [items, setItems] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    let cancelled = false;

    const t = setTimeout(() => {
      async function run() {
        setError(null);
        setIsLoading(true);
        setLoading(true);

        try {
          const res = q ? await searchCharacters(q, 50) : await listCharacters(50);
          if (!cancelled) {
            setItems(res.items);
            setTotal(res.total);
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
          if (!cancelled) {
            setIsLoading(false);
            setLoading(false);
          }
        }
      }

      run();
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, debounceMs, setLoading]);

  return { items, total, isLoading, error };
}