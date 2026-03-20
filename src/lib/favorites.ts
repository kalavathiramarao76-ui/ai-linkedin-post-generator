export interface FavoritePost {
  id: string;
  content: string;
  style: string;
  topic: string;
  createdAt: number;
}

const FAVORITES_KEY = "postcraft_favorites";

export function getFavorites(): FavoritePost[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(post: Omit<FavoritePost, "id" | "createdAt">): FavoritePost {
  const fav: FavoritePost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const favorites = getFavorites();
  favorites.unshift(fav);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 100)));
  window.dispatchEvent(new CustomEvent("favorites-changed"));
  return fav;
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favorites-changed"));
}

export function isFavorite(content: string): boolean {
  return getFavorites().some((f) => f.content === content);
}

export function getFavoriteByContent(content: string): FavoritePost | undefined {
  return getFavorites().find((f) => f.content === content);
}

export function getFavoritesCount(): number {
  return getFavorites().length;
}
