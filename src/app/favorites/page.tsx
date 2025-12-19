"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { getCharacter } from "@/api/comicvine";
import type { Character } from "@/types/domain";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingGrid } from "@/components/States/LoadingGrid";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const favIds = useMemo(() => Array.from(ids), [ids]);

  const [items, setItems] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (favIds.length === 0) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await Promise.all(favIds.map((id) => getCharacter(id)));
        if (!cancelled) setItems(res);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [favIds]);

  if (isLoading) return <LoadingGrid />;

  if (items.length === 0) {
    return <EmptyState title="No favorites yet" description="Add some characters to favorites." />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 16px", fontWeight: 900 }}>FAVORITES</h1>

      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {items.map((c) => (
          <li key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}