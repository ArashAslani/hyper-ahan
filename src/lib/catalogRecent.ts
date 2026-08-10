const RECENT_CATEGORIES_KEY = "ha_catalog_recent_categories";
const RECENT_SEARCHES_KEY = "ha_catalog_recent_searches";
const RECENT_TOOLS_KEY = "ha_catalog_recent_tools";
const MAX_RECENT = 8;

export type RecentCategory = {
  id: string;
  name: string;
  visitedAt: number;
};

export type RecentSearch = {
  q: string;
  visitedAt: number;
};

export type RecentTool = {
  slug: string;
  title: string;
  visitedAt: number;
};

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

function upsertRecent<T extends { visitedAt: number }>(
  key: string,
  item: T,
  same: (a: T, b: T) => boolean,
): T[] {
  const prev = readJson<T>(key).filter((x) => !same(x, item));
  const next = [{ ...item, visitedAt: Date.now() }, ...prev].slice(0, MAX_RECENT);
  writeJson(key, next);
  return next;
}

export const catalogRecent = {
  getCategories(): RecentCategory[] {
    return readJson<RecentCategory>(RECENT_CATEGORIES_KEY);
  },

  pushCategory(entry: Omit<RecentCategory, "visitedAt">): RecentCategory[] {
    return upsertRecent(
      RECENT_CATEGORIES_KEY,
      { ...entry, visitedAt: Date.now() },
      (a, b) => a.id === b.id,
    );
  },

  getSearches(): RecentSearch[] {
    return readJson<RecentSearch>(RECENT_SEARCHES_KEY);
  },

  pushSearch(q: string): RecentSearch[] {
    const trimmed = q.trim();
    if (trimmed.length < 2) return this.getSearches();
    return upsertRecent(
      RECENT_SEARCHES_KEY,
      { q: trimmed, visitedAt: Date.now() },
      (a, b) => a.q === b.q,
    );
  },

  getTools(): RecentTool[] {
    return readJson<RecentTool>(RECENT_TOOLS_KEY);
  },

  pushTool(entry: Omit<RecentTool, "visitedAt">): RecentTool[] {
    return upsertRecent(
      RECENT_TOOLS_KEY,
      { ...entry, visitedAt: Date.now() },
      (a, b) => a.slug === b.slug,
    );
  },
};
