import type { Character, Comic } from "@/types/domain";

type ComicVineImage = {
  small_url?: string;
  super_url?: string;
  original_url?: string;
};

type CVCharacter = {
  id: number;
  name: string;
  description?: string;
  image?: ComicVineImage;
};

type CVIssue = {
  id: number;
  name?: string;
  cover_date?: string | null;
  image?: ComicVineImage;
};

type CVListResponse<T> = {
  status_code: number;
  error: string;
  number_of_total_results: number;
  results: T[];
};

type CVSingleResponse<T> = {
  status_code: number;
  error: string;
  results: T;
};

function imgUrl(img?: ComicVineImage): string {
  return (
    img?.super_url ||
    img?.original_url ||
    img?.small_url ||
    "https://placehold.co/600x400?text=No+Image"
  );
}

function mapCharacter(c: CVCharacter): Character {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? "",
    imageUrl: imgUrl(c.image),
  };
}

function mapComic(i: CVIssue): Comic {
  return {
    id: i.id,
    title: i.name && i.name.trim().length ? i.name : `Issue #${i.id}`,
    imageUrl: imgUrl(i.image),
    coverDate: i.cover_date ?? null,
  };
}

async function cvFetch<T>(path: string, params?: Record<string, string | number>) {
  const url = new URL(`/api/comicvine/${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  const r = await fetch(url.toString());
  if (!r.ok) {
    throw new Error(`ComicVine request failed (${r.status})`);
  }
  return (await r.json()) as T;
}

export async function listCharacters(limit = 50): Promise<{
  items: Character[];
  total: number;
}> {
  const data = await cvFetch<CVListResponse<CVCharacter>>("characters", {
    limit,
    sort: "name:asc",
    field_list: "id,name,description,image",
  });

  return {
    items: data.results.map(mapCharacter),
    total: data.number_of_total_results,
  };
}

export async function searchCharacters(
  query: string,
  limit = 50
): Promise<{ items: Character[]; total: number }> {
  const q = query.trim();
  if (!q) return listCharacters(limit);

  const data = await cvFetch<CVListResponse<CVCharacter>>("characters", {
    limit,
    sort: "name:asc",
    filter: `name:${q}`,
    field_list: "id,name,description,image",
  });

  return {
    items: data.results.map(mapCharacter),
    total: data.number_of_total_results,
  };
}

/** Fetch a single character by ID. */
export async function getCharacter(id: number): Promise<Character> {
  const data = await cvFetch<CVSingleResponse<CVCharacter>>(`character/4005-${id}`, {
    field_list: "id,name,description,image",
  });

  return mapCharacter(data.results);
}

/** Fetch comics (issues) for a character.*/
export async function getCharacterComics(id: number, limit = 20): Promise<Comic[]> {
  // Strategy A: issues list endpoint + filter by character + sorted by date
  try {
    const data = await cvFetch<CVListResponse<CVIssue>>("issues", {
      limit,
      sort: "cover_date:desc",
      filter: `character:4005-${id}`,
      field_list: "id,name,cover_date,image",
    });

    return data.results.map(mapComic);
  } catch {
    // Strategy B (fallback): character detail -> issues -> resolve each issue
    const detail = await cvFetch<CVSingleResponse<any>>(`character/4005-${id}`, {
      field_list: "issues",
    });

    const issues: Array<{ api_detail_url?: string }> = detail.results?.issues ?? [];
    const first = issues.slice(0, limit);

    const resolved = await Promise.all(
      first.map(async (x) => {
        const apiUrl = x.api_detail_url;
        if (!apiUrl) return null;

        // Convert ComicVine api_detail_url into proxy path:
        const m = apiUrl.match(/\/api\/(issue\/\d+-\d+)\//);
        if (!m) return null;

        const single = await cvFetch<CVSingleResponse<CVIssue>>(m[1], {
          field_list: "id,name,cover_date,image",
        });

        return mapComic(single.results);
      })
    );

    // Ensure proper sorting (desc) and cap at limit
    return resolved
      .filter((x): x is Comic => Boolean(x))
      .sort((a, b) => (b.coverDate ?? "").localeCompare(a.coverDate ?? ""))
      .slice(0, limit);
  }
}