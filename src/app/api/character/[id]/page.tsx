"use client";

import { use, useEffect, useState } from "react";
import { getCharacter, getCharacterComics } from "@/api/comicvine";
import type { Character, Comic } from "@/types/domain";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { LoadingGrid } from "@/components/States/LoadingGrid";
import styles from "./page.module.css";

export default function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const characterId = Number(id);

  const { toggle, isFavorite } = useFavorites();

  const [character, setCharacter] = useState<Character | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const [c, cs] = await Promise.all([
          getCharacter(characterId),
          getCharacterComics(characterId, 20),
        ]);

        if (!cancelled) {
          setCharacter(c);
          setComics(cs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [characterId]);

  if (loading || !character) return <LoadingGrid />;

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <img
          src={character.imageUrl}
          alt={character.name}
          className={styles.heroImage}
        />

        <div className={styles.heroContent}>
          <h1 className={styles.title}>{character.name}</h1>

          <button
            onClick={() => toggle(character.id)}
            className={styles.favoriteBtn}
            aria-pressed={isFavorite(character.id)}
          >
            {isFavorite(character.id) ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}
          </button>

          {character.description && (
            <p className={styles.description}>{character.description}</p>
          )}
        </div>
      </section>

      {/* COMICS */}
      <section className={styles.comicsSection}>
        <h2 className={styles.comicsTitle}>COMICS</h2>

        <div className={styles.comicsRow}>
          {comics.map((c) => (
            <div key={c.id} className={styles.comicCard}>
              <img src={c.imageUrl} alt={c.title} />
              <div className={styles.comicTitle}>{c.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}