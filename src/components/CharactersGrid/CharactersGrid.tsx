import styles from "./CharactersGrid.module.css";
import type { Character } from "@/types/domain";
import { CharacterCard } from "@/components/CharacterCard/CharacterCard";

/**
 * CharactersGrid (DARK)
 * - Used in Home to match the mock (black card bottom bar + red line).
 */
export function CharactersGrid({ items }: { items: Character[] }) {
  return (
    <div className={styles.grid} role="list">
      {items.map((c) => (
        <div key={c.id} role="listitem">
          <CharacterCard character={c} />
        </div>
      ))}
    </div>
  );
}