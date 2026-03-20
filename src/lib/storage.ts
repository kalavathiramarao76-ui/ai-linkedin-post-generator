export interface SavedPost {
  id: string;
  content: string;
  style: string;
  topic: string;
  createdAt: number;
}

const STORAGE_KEY = "postcraft_saved_posts";
const DRAFTS_KEY = "postcraft_drafts";

export function getSavedPosts(): SavedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePost(post: Omit<SavedPost, "id" | "createdAt">): SavedPost {
  const saved: SavedPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const posts = getSavedPosts();
  posts.unshift(saved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.slice(0, 50)));
  return saved;
}

export function deletePost(id: string): void {
  const posts = getSavedPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function saveDraft(content: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFTS_KEY, content);
}

export function getDraft(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DRAFTS_KEY) || "";
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFTS_KEY);
}
