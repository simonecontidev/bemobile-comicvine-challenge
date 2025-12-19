"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { useGlobalLoading } from "@/features/loading/LoadingContext";

export function Header() {
  const { ids } = useFavorites();
  const { isLoading } = useGlobalLoading();

  const count = ids.size;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.logo}
          aria-label="Go to characters list"
        >
          <Image
            src="/Marvel-logo.svg"
            alt="Marvel"
            width={120}
            height={36}
            priority
          />
        </Link>

        <Link
          href="/favorites"
          className={styles.fav}
          aria-label={`Go to favorites (${count})`}
        >
          <Image
            src={count > 0 ? "/Union.svg" : "/Heart-icon.svg"}
            alt=""
            width={18}
            height={18}
            className={styles.likeIcon}
            priority
            aria-hidden="true"
          />

          {/* Use the class that exists in your CSS. Prefer .badge if present, fallback to .count if your CSS uses that name. */}
          <span className={styles.badge ?? styles.count}>{count}</span>
        </Link>
      </div>

      {isLoading && <div className={styles.redLine} />}
    </header>
  );
}