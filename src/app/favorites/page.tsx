"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { getCharacter } from "@/api/comicvine";
import type { Character } from "@/types/domain";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingGrid } from "@/components/States/LoadingGrid";
import { CharactersGrid } from "@/components/CharactersGrid/CharactersGrid";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const favIds = useMemo(() => Array.from(ids), [ids]);

  const [items, setItems] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (favIds.length === 0) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await Promise.all(favIds.map((id) => getCharacter(id)));
        if (!cancelled) setItems(res);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [favIds]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((c) => c.name.toLowerCase().includes(q));
  }, [items, q]);

  if (isLoading) return <LoadingGrid />;

  if (error) {
    return <EmptyState title="Something went wrong" description={error} />;
  }

  // Match Figma: show the page shell even when empty, but with an empty state.
  return (
        <section
      className="page-section"
      style={{
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
      }}
    >
      <h1 className="page-title">FAVORITES</h1>

      {/* Search */}
      <div
        className="search"
        style={{
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        <div
          className="searchRow"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingBottom: 10,
            borderBottom: "1px solid rgba(0,0,0,0.75)",
          }}
        >
          {/* Magnifier icon (inline so we don't depend on a file name) */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH A CHARACTER..."
            aria-label="Search a character"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 13,
              letterSpacing: 0.5,
              background: "transparent",
              textTransform: "uppercase",
            }}
          />
        </div>

        <div
          className="resultsCount"
          style={{
            marginTop: 10,
            fontSize: 11,
            letterSpacing: 0.5,
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          {filtered.length} RESULTS
        </div>
      </div>

      {favIds.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Add some characters to favorites to see them here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          description="Try a different search."
        />
      ) : (
        <CharactersGrid items={filtered} />
      )}
    </section>
  );
}