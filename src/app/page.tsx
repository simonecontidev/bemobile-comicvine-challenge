"use client";

import { useState } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingGrid } from "@/components/States/LoadingGrid";

export default function HomePage() {
  const [q, setQ] = useState("");
  const { items, isLoading, error } = useCharacters(q);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a character..."
          style={{ width: "100%", padding: 12 }}
        />
        <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          {items.length} results
        </div>
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : error ? (
        <EmptyState title="Something went wrong" description={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No results found" description="Try a different search." />
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {items.map((c) => (
            <li key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}