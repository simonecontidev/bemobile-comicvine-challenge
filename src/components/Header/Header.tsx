import styles from "./Header.module.css";
import Link from "next/link";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          MARVEL
        </Link>

        <Link href="/favorites" className={styles.fav}>
          FAVORITES <span className={styles.badge}>0</span>
        </Link>
      </div>
    </header>
  );
}