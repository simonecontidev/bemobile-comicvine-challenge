"use client";

import Image from "next/image";
import styles from "./SearchBar.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  resultsCount?: number;
};

export function SearchBar({ value, onChange, resultsCount }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.icon} aria-hidden>
          <Image
            src="/like-button.svg"
            alt=""
            width={16}
            height={16}
            className={styles.iconImg}
            priority
          />
        </span>

        <input
          className={styles.input}
          type="text"
          placeholder="SEARCH A CHARACTER..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {typeof resultsCount === "number" && (
        <div className={styles.results}>{resultsCount} results</div>
      )}
    </div>
  );
}