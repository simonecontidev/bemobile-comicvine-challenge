import styles from "./States.module.css";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.empty} role="status" aria-live="polite">
      <h2 className={styles.emptyTitle}>{title}</h2>
      {description ? <p className={styles.emptyDesc}>{description}</p> : null}
    </div>
  );
}