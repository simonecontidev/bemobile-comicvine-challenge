import styles from "./States.module.css";

export function LoadingGrid() {
  return (
    <div className={styles.grid} aria-label="Loading">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImg} />
          <div className={styles.skeletonRow} />
        </div>
      ))}
    </div>
  );
}