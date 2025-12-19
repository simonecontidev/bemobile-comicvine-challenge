"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ComicsList.module.css";
import type { Comic } from "@/types/domain";

/**
 * Custom scrollbar thumb:
 * - Grey track fixed width
 * - Red thumb moves and scales based on visible ratio + scroll position
 */
export function ComicsList({ items }: { items: Comic[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [thumb, setThumb] = useState({ leftPct: 0, widthPct: 20 });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const scrollW = el.scrollWidth;
      const viewW = el.clientWidth;

      if (scrollW <= 0 || viewW <= 0 || scrollW <= viewW) {
        setThumb({ leftPct: 0, widthPct: 100 });
        return;
      }

      const max = scrollW - viewW;
      const progress = el.scrollLeft / max; // 0..1
      const widthPct = (viewW / scrollW) * 100; // visible ratio
      const leftPct = progress * (100 - widthPct);

      setThumb({ leftPct, widthPct });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  return (
    <section aria-label="Comics list">
      <div className={styles.row} ref={scrollerRef}>
        {items.map((c) => {
          const year = c.coverDate ? c.coverDate.slice(0, 4) : "—";
          return (
            <article key={c.id} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.cover} src={c.imageUrl} alt={c.title} />
              <div className={styles.meta}>
                <div className={styles.cardTitle}>{c.title}</div>
                <div className={styles.year}>{year}</div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.scrollbar} aria-hidden="true">
        <div
          className={styles.scrollbarFill}
          style={{
            width: `${thumb.widthPct}%`,
            transform: `translateX(${thumb.leftPct}%)`,
          }}
        />
      </div>
    </section>
  );
}