"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { CharactersGrid } from "@/components/CharactersGrid/CharactersGrid";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingGrid } from "@/components/States/LoadingGrid";
import { useCharacters } from "@/hooks/useCharacters";

export default function HomePage() {
  const [q, setQ] = useState("");
  const { items, isLoading, error } = useCharacters(q);

  return (
    <>
      <SearchBar value={q} onChange={setQ} resultsCount={items.length} />

      {isLoading ? (
        <LoadingGrid />
      ) : error ? (
        <EmptyState title="Something went wrong" description={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No results found" description="Try a different search." />
      ) : (
        <CharactersGrid items={items} />
      )}
    </>
  );
}