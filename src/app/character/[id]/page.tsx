import type { Character, Comic } from "@/types/domain";
import { EmptyState } from "@/components/States/EmptyState";
import { ComicsList } from "@/components/ComicsList/ComicsList";
import styles from "./page.module.css";
import { FavoriteButton } from "./FavoriteButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function fetchCharacter(id: number): Promise<Character> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = new URL(`/api/comicvine/character/4005-${id}`, baseUrl);
  url.searchParams.set("field_list", "id,name,description,image");

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error(`Character fetch failed (${r.status})`);
  const data = await r.json();

  const img =
    data?.results?.image?.super_url ||
    data?.results?.image?.original_url ||
    data?.results?.image?.small_url ||
    "https://placehold.co/600x400?text=No+Image";

  return {
    id: data.results.id,
    name: data.results.name,
    description: data.results.description ?? "",
    imageUrl: img,
  };
}

async function fetchCharacterComics(id: number, limit = 20): Promise<Comic[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = new URL(`/api/comicvine/issues`, baseUrl);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "cover_date:desc");
  url.searchParams.set("filter", `character:4005-${id}`);
  url.searchParams.set("field_list", "id,name,cover_date,image");

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error(`Comics fetch failed (${r.status})`);
  const data = await r.json();

  const results: any[] = data?.results ?? [];
  return results.map((i) => ({
    id: i.id,
    title: i.name && String(i.name).trim().length ? i.name : `Issue #${i.id}`,
    imageUrl:
      i?.image?.super_url ||
      i?.image?.original_url ||
      i?.image?.small_url ||
      "https://placehold.co/600x400?text=No+Image",
    coverDate: i.cover_date ?? null,
  }));
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return (
      <EmptyState
        title="Invalid character id"
        description="Please go back and try again."
      />
    );
  }

  try {
    const [character, comics] = await Promise.all([
      fetchCharacter(id),
      fetchCharacterComics(id, 20),
    ]);

    const safeDescription =
      character.description?.trim()
        ? character.description.replace(/<[^>]*>/g, "")
        : "No description available.";

    return (
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.boxed}>
            <div className={styles.heroInner}>
              <div className={styles.poster}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={character.imageUrl} alt={character.name} />
              </div>

              <div className={styles.info}>
                <h1 className={styles.name}>{character.name}</h1>
                <p className={styles.desc}>{safeDescription}</p>
              </div>

              <FavoriteButton id={character.id} />
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.boxed}>
            {comics.length === 0 ? (
              <EmptyState
                title="No comics found"
                description="This character has no associated issues."
              />
            ) : (
              <>
                <h2 className={styles.sectionTitle}>COMICS</h2>
                <ComicsList items={comics} />
              </>
            )}
          </div>
        </section>
      </div>
    );
  } catch (e) {
    return (
      <EmptyState
        title="Something went wrong"
        description={e instanceof Error ? e.message : "Unknown error"}
      />
    );
  }
}