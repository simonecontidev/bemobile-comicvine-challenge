"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./CharacterCard.module.css";
import type { Character } from "@/types/domain";
import { useFavorites } from "@/features/favorites/FavoritesContext";

export function CharacterCard({ character }: { character: Character }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(character.id);

  return (
    <article className={styles.card}>
      <Link href={`/character/${character.id}`} className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.imageUrl}
          alt={character.name}
          className={styles.img}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/600x900?text=No+Image";
          }}
        />
      </Link>

      <div className={styles.overlay}>
        <div className={styles.redLine} />

        <div className={styles.bottom}>
          <span className={styles.name}>
            {character.name ? character.name.toUpperCase() : "NAME"}
          </span>

         <button
  type="button"
  className={styles.favBtn}
  aria-label={fav ? "Remove from favorites" : "Add to favorites"}
  onClick={() => toggle(character.id)}
>
  {fav ? (
    <Image
      src="/union.svg"
      alt=""
      width={16}
      height={16}
      className={styles.favIconActive}
      priority
    />
  ) : (
    <Image
      src="/heart-icon.svg"
      alt=""
      width={16}
      height={16}
      className={styles.favIcon}
      priority
    />
  )}
</button>
        </div>
      </div>
    </article>
  );
}