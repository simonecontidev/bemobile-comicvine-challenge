"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useFavorites } from "@/features/favorites/FavoritesContext";

export function Header() {
  const { ids } = useFavorites();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Marvel">
          <img src="/marvel-logo.svg" alt="Marvel" height={26} />
        </Link>

        <Link href="/favorites" className={styles.fav} aria-label="Favorites">
          <img src="/heart-icon.svg" alt="" aria-hidden="true" />
          <span className={styles.badge}>{ids.size}</span>
        </Link>
      </div>
    </header>
  );
}