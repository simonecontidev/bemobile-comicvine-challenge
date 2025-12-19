"use client";

import Image from "next/image";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import styles from "./page.module.css";

export function FavoriteButton({ id }: { id: number }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(id);

  return (
    <button
      type="button"
      className={styles.fav}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      onClick={() => toggle(id)}
    >
      <Image
        src={fav ? "/Union.svg" : "/Heart-icon.svg"}
        alt=""
        width={18}
        height={18}
        className={styles.favIcon}
        aria-hidden="true"
        priority
      />
    </button>
  );
}