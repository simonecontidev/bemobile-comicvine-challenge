"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { useGlobalLoading } from "@/features/loading/LoadingContext";
import { CharactersGrid } from "@/components/CharactersGrid/CharactersGrid";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingGrid } from "@/components/States/LoadingGrid";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import type { Character } from "@/types/domain";
import { getCharacter } from "@/api/comicvine";

export function FavoritesClient() {
  const { ids } = useFavorites();
  const favIds = useMemo(() => Array.from(ids), [ids]);
  const { setLoading } = useGlobalLoading();

  const [items, setItems] = useState<Character[]>([]);
  const [q, setQ] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);

      if (favIds.length === 0) {
        setItems([]);
        return;
      }

      setLocalLoading(true);
      setLoading(true);

      try {
        const results = await Promise.all(favIds.map((id) => getCharacter(id)));
        if (!cancelled) setItems(results);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) {
          setLocalLoading(false);
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [favIds, setLoading]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((c) => c.name.toLowerCase().includes(s));
  }, [q, items]);

  if (localLoading) return <LoadingGrid />;
  if (error) return <EmptyState title="Something went wrong" description={error} />;

  if (favIds.length === 0) {
    return <EmptyState title="No favorites yet" description="Add some characters to favorites." />;
  }

  return (
    <>
      <div style={{ padding: "24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>FAVORITES</h1>
      </div>

      <SearchBar value={q} onChange={setQ} resultsCount={filtered.length} />

      {filtered.length === 0 ? (
        <EmptyState title="No results found" description="Try a different search." />
      ) : (
        <CharactersGrid items={filtered} />
      )}
    </>
  );
}